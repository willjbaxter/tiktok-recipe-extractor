import axios from 'axios';

const RECIPE_PROMPT = (videoUrl: string) => `You are a recipe extraction assistant. Your task is to extract recipe information from a TikTok video URL and return it in a specific JSON format.

For this TikTok video: ${videoUrl}

Return ONLY valid JSON that matches this exact structure, with no additional text or explanation:
{
  "recipe_overview": {
    "title": "Recipe Title",
    "prep_time": "15 mins",
    "cook_time": "30 mins",
    "servings": 4,
    "difficulty": "Easy"
  },
  "ingredients": [
    {
      "item": "Ingredient Name",
      "amount": "1",
      "unit": "cup",
      "notes": "optional notes"
    }
  ],
  "equipment": [
    "Required Equipment 1",
    "Required Equipment 2"
  ],
  "instructions": [
    "Step 1 instruction",
    "Step 2 instruction"
  ]
}

Remember:
1. Return ONLY the JSON object, no other text
2. Ensure all strings are properly quoted
3. Numbers should not be in quotes
4. Array elements should be properly comma-separated`;

export async function generateRecipe(videoUrl: string, apiKey: string) {
  try {
    console.log('Attempting to call Gemini API with URL:', videoUrl);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: RECIPE_PROMPT(videoUrl)
        }]
      }]
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

    console.log('Gemini API response:', JSON.stringify(response.data, null, 2));

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw generated text:', generatedText);
    
    try {
      // Try to extract JSON if there's any surrounding text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
      
      const parsedData = JSON.parse(jsonString);
      console.log('Successfully parsed recipe data:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw text that failed to parse:', generatedText);
      if (error instanceof Error) {
        throw new Error('Failed to parse recipe data: ' + error.message);
      }
      throw new Error('Failed to parse recipe data');
    }
  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: (error as any).response?.data,
      status: (error as any).response?.status
    });
    
    if ((error as any).response?.status === 401) {
      throw new Error('API key authentication failed - please check API key format and permissions');
    }
    
    if ((error as any).response?.status === 400) {
      throw new Error('Invalid request to Gemini API: ' + (error as any).response.data?.error?.message);
    }
    
    throw new Error('Failed to generate recipe: ' + ((error as any).response?.data?.error?.message || (error instanceof Error ? error.message : 'Unknown error')));
  }
}