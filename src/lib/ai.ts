import axios from 'axios';

// More specific type for the recipe response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const RECIPE_PROMPT = (videoUrl: string) => `You are a TikTok recipe extractor. Extract recipe details from this URL: ${videoUrl}

Context: The video shows how to prepare the recipe. Focus on identifying the actual recipe being demonstrated, not just keywords in the URL.

Requirements:
1. Watch for visual cues and descriptive elements that indicate the actual recipe being made
2. Ensure the recipe title matches the actual dish being prepared
3. If the recipe type is unclear, look for:
   - Video title/description
   - Key ingredients mentioned
   - Cooking methods shown
   - Final dish appearance

Return ONLY a JSON object in this exact format:
{
  "recipe_overview": {
    "title": "Recipe name - be specific about the main dish shown",
    "prep_time": "Prep time in minutes",
    "cook_time": "Cook time in minutes",
    "servings": 4,
    "difficulty": "Easy/Medium/Hard",
    "cuisine_type": "Type of cuisine (if identifiable)"
  },
  "ingredients": [
    {
      "item": "Ingredient name",
      "amount": "numeric amount",
      "unit": "measurement unit",
      "notes": "optional preparation notes"
    }
  ],
  "equipment": [
    "Required equipment 1",
    "Required equipment 2"
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ]
}

If recipe cannot be determined with high confidence, return:
{
  "error": "Could not extract recipe - insufficient information"
}

Return ONLY the JSON object, no additional text.`;

export async function generateRecipe(videoUrl: string, apiKey: string) {
  if (!videoUrl || !apiKey) {
    throw new Error('Missing required parameters: videoUrl or apiKey');
  }

  try {
    // Validate URL format
    if (!videoUrl.includes('tiktok.com')) {
      throw new Error('Invalid TikTok URL format');
    }

    const requestBody = {
      contents: [{
        parts: [{
          text: RECIPE_PROMPT(videoUrl)
        }]
      }],
      generationConfig: {
        temperature: 0.3, // Lower temperature for more focused responses
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('Sending request to Gemini API...');
    const response = await axios.post<GeminiResponse>(
      apiEndpoint,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw response from Gemini:', generatedText);
    
    // Extract and validate JSON
    let jsonText = generatedText.trim();
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in response');
    }
    
    jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
    
    try {
      const parsedData = JSON.parse(jsonText);
      
      // Validate response structure
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }
      
      if (!parsedData.recipe_overview || !parsedData.ingredients || !parsedData.instructions) {
        throw new Error('Invalid recipe data structure');
      }
      
      return parsedData;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Failed to parse recipe data: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Enhanced error messages based on error type
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Invalid request to Gemini API - please check API key and request format');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded - please try again later');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again');
      }
      throw new Error(`API request failed: ${error.response?.status} - ${error.response?.statusText || error.message}`);
    }
    
    throw new Error(`Failed to generate recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}