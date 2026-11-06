import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Deny Kurniawan (@dekakrens)';
    const subtitle =
      searchParams.get('subtitle') ||
      'React Developer & DevOps-Minded Software Engineer';
    const tag = searchParams.get('tag') || 'Software Engineering';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#09090b',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #18181b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #18181b 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 80px',
            color: '#fafafa',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: '#ffffff',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)',
                }}
              >
                DK
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Deny Kurniawan
                </span>
                <span style={{ fontSize: '15px', color: '#a1a1aa' }}>
                  @dekakrens
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: '1px solid #27272a',
                backgroundColor: '#18181b',
                color: '#38bdf8',
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1040px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 55 ? '46px' : title.length > 35 ? '54px' : '64px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '22px',
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #27272a',
              paddingTop: '26px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                fontSize: '16px',
                color: '#71717a',
              }}
            >
              <span>Next.js 15 Standalone</span>
              <span>•</span>
              <span>React & TypeScript</span>
              <span>•</span>
              <span>NestJS & Drizzle</span>
              <span>•</span>
              <span>ARM64 Raspberry Pi</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 700,
                color: '#38bdf8',
              }}
            >
              dekakrens.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
