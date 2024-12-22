import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    const pythonServiceUrl = process.env.NEXT_PUBLIC_PYTHON_SERVICE_URL;

    console.log('Processing video URL:', videoUrl);
    console.log('Python service URL:', pythonServiceUrl); // Add this log

    if (!pythonServiceUrl) {
      console.error('Python service URL not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(`${pythonServiceUrl}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    console.log('Response status:', response.status); // Add this log

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python service error:', errorText);
      return NextResponse.json(
        { error: errorText || 'Failed to process video' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log('Raw response data:', responseData); // Add this log

    // Updated response handling
    return NextResponse.json({ 
      status: responseData.status,
      data: responseData.data,
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