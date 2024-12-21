import { NextResponse } from 'next/server';
import { generateRecipe } from '../../../lib/ai';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Add debugging
    console.log('Received request with URL:', videoUrl);

    // Validate input
    if (!videoUrl) {
      console.log('Missing video URL');
      return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }

    if (!apiKey) {
      console.log('API key not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate recipe using Gemini
    const recipeData = await generateRecipe(videoUrl, apiKey);
    console.log('Generated recipe data:', recipeData);

    return NextResponse.json({ data: recipeData });
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to generate recipe: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}