import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getProfile } from '@/lib/api';

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar availabilityBadge={profile.availabilityBadge} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
