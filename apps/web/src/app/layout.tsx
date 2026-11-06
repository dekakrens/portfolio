import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getProfile } from '@/lib/api';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL('https://dekakrens.com'),
  title: {
    default: 'Deny Kurniawan (@dekakrens) | React Developer & DevOps-Minded Software Engineer',
    template: '%s | Deny Kurniawan (@dekakrens)',
  },
  description:
    'Frontend-focused Software Engineer with 4+ years of experience building and shipping production web and mobile applications using React, Next.js, React Native, and TypeScript with hands-on Docker, CI/CD, and production monitoring.',
  keywords: [
    'Deny Kurniawan',
    'dekakrens',
    'Deka Krens',
    'Deny Kurniawan portfolio',
    'React Developer',
    'React Native Developer',
    'Frontend Engineer',
    'DevOps Software Engineer',
    'Next.js 15',
    'Flutter',
    'Docker',
    'CI/CD',
    'NestJS',
    'PostgreSQL',
    'TypeScript',
  ],
  authors: [{ name: 'Deny Kurniawan (dekakrens)', url: 'https://dekakrens.com' }],
  creator: 'Deny Kurniawan (@dekakrens)',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dekakrens.com',
    siteName: 'Deny Kurniawan (@dekakrens) Portfolio',
    title: 'Deny Kurniawan (@dekakrens) | React Developer & DevOps-Minded Software Engineer',
    description:
      'Explore featured projects, production experience, and engineering background of Deny Kurniawan (@dekakrens).',
    images: [
      {
        url: 'https://dekakrens.com/api/og?title=Deny%20Kurniawan%20(%40dekakrens)&subtitle=React%20Developer%20%7C%20DevOps-Minded%20Software%20Engineer&tag=Engineering%20Portfolio',
        width: 1200,
        height: 630,
        alt: 'Deny Kurniawan (@dekakrens) - Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deny Kurniawan (@dekakrens) | React Developer & DevOps-Minded Software Engineer',
    description:
      'Frontend-focused Software Engineer with 4+ years building production web and mobile apps with React, React Native, Next.js, and Docker.',
    creator: '@dekakrens',
    images: [
      'https://dekakrens.com/api/og?title=Deny%20Kurniawan%20(%40dekakrens)&subtitle=React%20Developer%20%7C%20DevOps-Minded%20Software%20Engineer&tag=Engineering%20Portfolio',
    ],
  },
  alternates: {
    canonical: 'https://dekakrens.com',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  // Root JSON-LD Schema (Person) with alternateName for dekakrens handle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Deny Kurniawan',
    alternateName: 'dekakrens',
    jobTitle: profile.headline,
    url: 'https://dekakrens.com',
    sameAs: [
      profile.socialLinks.github,
      profile.socialLinks.linkedin,
      profile.socialLinks.twitter,
    ].filter(Boolean),
    knowsAbout: [
      'Full-Stack Web Development',
      'Next.js',
      'NestJS',
      'PostgreSQL',
      'Drizzle ORM',
      'Embedded Systems',
      'ESP32',
      'Computer Vision',
      'IoT Telemetry',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased font-sans flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar availabilityBadge={profile.availabilityBadge} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
