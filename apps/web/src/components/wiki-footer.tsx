import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ExternalLink, Shield } from 'lucide-react';

export function WikiFooter() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-12 bg-white dark:bg-neutral-950 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Deny Kurniawan</span>
            <span className="text-xs text-neutral-400 font-mono">(@dekakrens)</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            Digital Garden &amp; Engineering Wiki. Living documentation, architecture write-ups, and field notes.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>
          <Link
            href="/#projects"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Sitemap
          </Link>
          <Link
            href="/admin"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors opacity-70 hover:opacity-100 flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>

        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          © {new Date().getFullYear()} Deny Kurniawan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
