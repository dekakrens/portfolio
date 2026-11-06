import React from 'react';
import { WikiNavbar } from '@/components/wiki-navbar';
import { WikiFooter } from '@/components/wiki-footer';

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <WikiNavbar />
      <main className="flex-1">{children}</main>
      <WikiFooter />
    </div>
  );
}
