import axios from 'axios';

const RECIPE_PROMPT = (videoUrl: string) => `
Extract the recipe from this TikTok video: ${videoUrl}

Please provide the recipe in the following structured format:
{
  "recipe_overview": {
    "title": "[Recipe Title]",
    "prep_time": "[Preparation Time]",
    "cook_time": "[Cooking Time]",
    "servings": [Number of Servings],
    "difficulty": "[Difficulty Level]"
  },
  "ingredients": [
    {
      "item": "[Ingredient Name]",
      "amount": "[Amount]",
      "unit": "[Unit of Measurement]",
      "notes": "[Optional Notes]"
    }
  ],
  "equipment": ["[Required Equipment]"],
  "instructions": ["[Step-by-step Instructions]"]
}`;

export async function generateRecipe(videoUrl: string, apiKey: string) {
  try {
    console.log('Attempting to call Gemini API with URL:', videoUrl);
    console.log('API Key length:', apiKey?.length); // Don't log the full key
    
    const requestBody = {
      contents: [{
        parts: [{
          text: RECIPE_PROMPT(videoUrl)
        }]
      }]
    };

    const apiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
    console.log('API Endpoint:', apiEndpoint);

    const response = await axios.post(
      apiEndpoint,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        params: {
          key: apiKey
        }
      }
    );

    // Rest of the function remains the same...
  } catch (error) {
    console.error('Detailed auth error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any).response?.status,
      statusText: (error as any).response?.statusText,
      data: (error as any).response?.data,
      headers: (error as any).config?.headers // Log request headers
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