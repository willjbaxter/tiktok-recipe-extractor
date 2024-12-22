import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL;

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
      const error = await response.json();
      console.error('Python service error:', error);
      return NextResponse.json(
        { error: error.detail || 'Failed to process video' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log('Recipe data received:', responseData);

    // The Python service returns { status: 'success', data: {...} }
    // We want to maintain the same structure the frontend expects
    return NextResponse.json({ 
      data: responseData.data,
      error: null 
    });

  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to extract recipe: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}