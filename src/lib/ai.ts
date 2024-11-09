import OpenAI from 'openai';

const recipeExtractionSchema = {
  name: "extract_recipe",
  description: "Extract structured recipe information from cooking videos",
  parameters: {
    type: "object",
    properties: {
      recipe_overview: {
        type: "object",
        properties: {
          title: { type: "string" },
          prep_time: { type: "string" },
          cook_time: { type: "string" },
          servings: { type: "integer" },
          difficulty: { 
            type: "string",
            enum: ["Easy", "Intermediate", "Advanced"]
          },
          cuisine_type: { type: "string" }
        },
        required: ["title", "servings"]
      },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string" },
            amount: { type: "string" },
            unit: { type: "string" },
            notes: { type: "string" }
          },
          required: ["item", "amount"]
        }
      },
      instructions: {
        type: "array",
        items: { type: "string" }
      },
      equipment: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["recipe_overview", "ingredients", "instructions"]
  }
};

  
  function adjustAmount(amount:string, ratio:number) {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return amount;
    return (numericAmount * ratio).toFixed(2).toString();
  }

export async function transcribeRecipe(videoUrl:string,apiKey:string) {
  try {
    const openai = new OpenAI({
        apiKey,
      });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `You are a professional chef that extracts recipe information from cooking videos.
                   Analyze this video ${videoUrl} content and provide detailed ingredient lists and cooking instructions.
                   Focus on precise measurements and important preparation notes.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract the recipe information from this video:"
            
            }
          ]
        }
      ],
      tools: [{
        type: "function",
        function: recipeExtractionSchema
      }],
      tool_choice: { type: "function", function: { name: "extract_recipe" } }
    });
    return JSON.parse(response.choices[0].message.tool_calls?.[0]?.function.arguments || "")

  } catch (error) {
    console.error('Error transcribing recipe:', error);
    throw error;
  }
}
