import axios from 'axios';

const RECIPE_PROMPT = (videoUrl: string) => `You are a JSON generator for recipe data. Extract recipe information from this TikTok video URL: ${videoUrl}

Return ONLY a JSON object in this EXACT format:
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
      "item": "First Ingredient",
      "amount": "1",
      "unit": "cup",
      "notes": "at room temperature"
    }
  ],
  "equipment": [
    "Bowl",
    "Whisk"
  ],
  "instructions": [
    "First step of the recipe",
    "Second step of the recipe"
  ]
}

IMPORTANT: Return ONLY the JSON. No other text, explanations, or markdown formatting.`;

export async function generateRecipe(videoUrl: string, apiKey: string) {
  try {
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

    const generatedText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw response from Gemini:', generatedText);
    
    // Try to extract just the JSON part if there's any surrounding text
    let jsonText = generatedText;
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonText = generatedText.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('Attempting to parse JSON:', jsonText);
    
    try {
      const parsedData = JSON.parse(jsonText);
      return parsedData;
    } catch (error) {
      console.error('JSON Parse Error. Text at position 1256:', jsonText.substring(1250, 1260));
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