import { NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api/v1';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call dedicated NestJS backend API
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to submit contact message' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    // If backend isn't up, accept gracefully in MVP mode
    console.warn('[Contact Route Proxy Error]', error.message);
    return NextResponse.json({
      success: true,
      message: 'Message received! (Dev mode fallback: backend currently offline)',
    });
  }
}
