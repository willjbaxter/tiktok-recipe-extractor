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
    
    try {
      const parsedData = JSON.parse(generatedText);
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