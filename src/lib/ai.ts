import axios from 'axios';

const RECIPE_PROMPT = (videoUrl: string) => `You are a TikTok recipe extractor. Here is a TikTok URL containing a video recipe: ${videoUrl}

Note: If you cannot access the video content directly:
1. Look for recipe information in the video URL, title, or description
2. If you see keywords or hashtags indicating the recipe type (like #soup, #vegan, etc.), use those
3. If you can't determine the recipe with confidence, return a specific error message

Return ONLY a JSON object in this format:
{
  "recipe_overview": {
    "title": "Recipe name - be specific about the dish",
    "prep_time": "Prep time in minutes",
    "cook_time": "Cook time in minutes",
    "servings": 4,
    "difficulty": "Easy/Medium/Hard"
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

If you cannot determine the recipe with confidence, instead return:
{
  "error": "Could not extract recipe - insufficient information"
}

Return ONLY the JSON object, no other text or explanations.`;

export async function generateRecipe(videoUrl: string, apiKey: string) {
  try {
    const requestBody = {
      contents: [{
        parts: [{
          text: RECIPE_PROMPT(videoUrl)
        }]
      }],
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await axios.post(
      apiEndpoint,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw response from Gemini:', generatedText);
    
    // Try to extract just the JSON part
    let jsonText = generatedText.trim();
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
    }
    
    try {
      const parsedData = JSON.parse(jsonText);
      
      // Check if we got an error response
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }
      
      return parsedData;
    } catch (error) {
      console.error('JSON Parse Error:', error);
      if (error instanceof Error) {
        throw new Error('Failed to parse recipe data: ' + error.message);
      }
      throw new Error('Failed to parse recipe data');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to generate recipe: ' + error.message);
    }
    throw new Error('Failed to generate recipe');
  }
}