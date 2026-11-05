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
    default: 'Deka Krens | Senior Full-Stack & IoT Systems Engineer',
    template: '%s | Deka Krens',
  },
  description:
    'Senior Full-Stack & IoT Systems Engineer specializing in Next.js, NestJS, PostgreSQL, embedded C++ (ESP32), and edge computer vision systems.',
  keywords: [
    'Deka Krens',
    'Full-Stack Developer',
    'IoT Systems Engineer',
    'Next.js 15',
    'NestJS',
    'PostgreSQL',
    'Drizzle ORM',
    'ESP32',
    'OpenCV',
    'Home Assistant',
    'TypeScript',
  ],
  authors: [{ name: 'Deka Krens', url: 'https://dekakrens.com' }],
  creator: 'Deka Krens',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dekakrens.com',
    siteName: 'Deka Krens Portfolio',
    title: 'Deka Krens | Senior Full-Stack & IoT Systems Engineer',
    description:
      'Explore featured projects, technical case studies, and engineering background.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deka Krens | Senior Full-Stack & IoT Systems Engineer',
    description:
      'Senior Full-Stack & IoT Systems Engineer specializing in Next.js, NestJS, and edge IoT devices.',
    creator: '@dekakrens',
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

  // Root JSON-LD Schema (Person)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Deka Krens',
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
