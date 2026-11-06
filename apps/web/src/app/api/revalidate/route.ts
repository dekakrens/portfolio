import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret =
      searchParams.get('secret') ||
      request.headers.get('x-revalidation-secret');

    const expectedSecret =
      process.env.REVALIDATION_SECRET || 'dekakrens_super_secret_revalidate_2026';

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid revalidation secret token' },
        { status: 401 },
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if passing query params
    }

    const path = searchParams.get('path') || body.path;
    const tag = searchParams.get('tag') || body.tag;
    const purgeAll = searchParams.get('all') === 'true' || body.all === true;

    if (purgeAll) {
      revalidatePath('/', 'layout');
      return NextResponse.json({
        revalidated: true,
        type: 'all',
        timestamp: new Date().toISOString(),
      });
    }

    if (tag) {
      revalidateTag(tag, { expire: 0 });
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        tag,
        timestamp: new Date().toISOString(),
      });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        path,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { message: 'Missing tag, path, or all parameter to revalidate' },
      { status: 400 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Revalidation error', error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Support GET for quick manual browser or curl pings
  return POST(request);
}
