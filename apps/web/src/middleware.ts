import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const { pathname } = req.nextUrl;

  // Check if request is hitting the legacy wiki subdomain
  const isWikiSubdomain = host.startsWith('wiki.');

  if (isWikiSubdomain) {
    // Permanently redirect all wiki subdomain traffic to dekakrens.com/wiki
    const cleanPath =
      pathname === '/'
        ? '/wiki'
        : pathname.startsWith('/wiki')
          ? pathname
          : `/wiki${pathname}`;

    return NextResponse.redirect(`https://dekakrens.com${cleanPath}`, 301);
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
