import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-12 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start">
          <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Deny Kurniawan</span>
            <span className="text-xs text-neutral-400 font-mono">(@dekakrens)</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Engineered with Next.js 15, NestJS, Drizzle ORM &amp; PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <Link href="#projects" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="#skills" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Skills
          </Link>
          <Link href="#experience" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Experience
          </Link>
          <Link href="#contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} Deny Kurniawan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
