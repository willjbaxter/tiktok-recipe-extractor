import { NextResponse } from 'next/server';
import { transcribeRecipe } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl,apiKey } = body;

    if (!videoUrl || !apiKey) {
        console.log("Video URL and API Key are required")
      return NextResponse.json(
        { error: 'Video URL and API Key are required' },
        { status: 400 }
      );
    }

    const data = await transcribeRecipe(videoUrl,apiKey);

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );

  } catch (error) {
    console.error('Recipe extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract recipe data' },
      { status: 500 }
    );
  }
}
