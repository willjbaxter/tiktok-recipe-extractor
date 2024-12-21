import axios from 'axios';

// Define the base prompt template for recipe extraction
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

/**
 * Generates a recipe based on the TikTok video URL using Google's Gemini API.
 * @param videoUrl - The URL of the TikTok video containing the recipe
 * @param apiKey - The Gemini API key
 * @returns A promise that resolves to the structured recipe data
 */
export async function generateRecipe(videoUrl: string, apiKey: string) {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: RECIPE_PROMPT(videoUrl)
          }]
        }]
      },
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

    // Extract the response text from Gemini's response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    try {
      return JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse recipe data');
    }
  } catch (error: any) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error('Failed to generate recipe');
  }
}