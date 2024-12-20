import { NextResponse } from 'next/server';
import { generateRecipe } from '../../../lib/ai';

/**
 * Handles POST requests to generate recipes using Gemini API.
 * Expects a JSON body with a 'prompt' field.
 */
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt provided' }, { status: 400 });
    }

    // Generate recipe using Gemini
    const recipe = await generateRecipe(prompt);

    return NextResponse.json({ recipe });
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}