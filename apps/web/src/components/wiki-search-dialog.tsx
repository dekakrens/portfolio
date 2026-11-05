'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, ArrowRight, X, Command } from 'lucide-react';
import { WikiArticleMeta } from '@/types/wiki';

interface WikiSearchDialogProps {
  articles: WikiArticleMeta[];
  isOpen: boolean;
  onClose: () => void;
}

export function WikiSearchDialog({ articles, isOpen, onClose }: WikiSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.summary?.toLowerCase().includes(query.toLowerCase()) ||
          a.category?.name.toLowerCase().includes(query.toLowerCase()),
      )
    : articles.slice(0, 5);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        if (filtered[selectedIndex]) {
          e.preventDefault();
          router.push(`/wiki/${filtered[selectedIndex].slug}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, notes, guides, and technologies..."
            className="flex-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 text-sm sm:text-base outline-none"
            autoFocus
          />
          <div className="flex items-center gap-1.5 ml-2">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No matching articles found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((article, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={article.id}
                    onClick={() => {
                      router.push(`/wiki/${article.slug}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <FileText
                        className={`w-4 h-4 mt-1 shrink-0 ${
                          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                          {article.title}
                        </div>
                        {article.summary && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                            {article.summary}
                          </div>
                        )}
                        {article.category && (
                          <span className="inline-block mt-1.5 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-emerald-600 dark:text-emerald-400' : 'opacity-0'
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded mr-1">↵</kbd>
              Open
            </span>
          </div>
          <span>Digital Garden Wiki</span>
        </div>
      </div>
    </div>
  );
}
