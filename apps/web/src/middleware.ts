import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const { pathname } = req.nextUrl;

  // Check if request is hitting the wiki subdomain
  const isWikiSubdomain = host.startsWith('wiki.');

  if (isWikiSubdomain) {
    // If accessing the root of wiki subdomain, rewrite to /wiki
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/wiki', req.url));
    }

    // If accessing an article path directly on wiki subdomain, rewrite to /wiki/:path
    if (
      !pathname.startsWith('/wiki') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/api') &&
      !pathname.includes('.')
    ) {
      return NextResponse.rewrite(new URL(`/wiki${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
