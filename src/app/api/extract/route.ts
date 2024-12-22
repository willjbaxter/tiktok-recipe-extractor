import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    const pythonServiceUrl = process.env.NEXT_PUBLIC_PYTHON_SERVICE_URL;

    console.log('Processing video URL:', videoUrl);

    if (!pythonServiceUrl) {
      console.error('Python service URL not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log('Calling Python service at:', pythonServiceUrl);
    
    const response = await fetch(`${pythonServiceUrl}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python service error:', errorText);
      return NextResponse.json(
        { error: errorText || 'Failed to process video' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log('Recipe data received:', responseData);

    return NextResponse.json({ 
      data: responseData.data || responseData.recipe,
      error: null 
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to extract recipe: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}