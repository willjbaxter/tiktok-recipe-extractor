import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

// Initialize Axios instance for Gemini API
const geminiApiClient = axios.create({
  baseURL: 'https://gemini.googleapis.com/v1', // Replace with the actual Gemini API base URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GEMINI_API_KEY}`,
  },
});

/**
 * Generates a recipe based on the provided prompt using Google's Gemini API.
 * @param prompt - The recipe prompt extracted from the TikTok video.
 * @returns A promise that resolves to the generated recipe text.
 */
export async function generateRecipe(prompt: string): Promise<string> {
  try {
    const response = await geminiApiClient.post('/generations', {
      model: "gemini-1.5-flash", // Ensure this matches Gemini's available models
      prompt: prompt,
      max_tokens: 150, // Example parameter; adjust based on Gemini's API
    });

    // Adjust based on Gemini's response structure
    return response.data.text;
  } catch (error: any) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw new Error('Failed to generate recipe');
  }
}