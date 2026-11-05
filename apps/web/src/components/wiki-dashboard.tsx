'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, Calendar, ArrowRight, Sparkles, Command } from 'lucide-react';
import { WikiCategory, WikiArticleMeta } from '@/types/wiki';
import { WikiSearchDialog } from './wiki-search-dialog';

interface WikiDashboardProps {
  categories: WikiCategory[];
  articles: WikiArticleMeta[];
}

export function WikiDashboard({ categories, articles }: WikiDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' || article.category?.slug === selectedCategory;

    const matchesSearch =
      !searchTerm.trim() ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Search Dialog Modal */}
      <WikiSearchDialog
        articles={articles}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Deny Kurniawan&apos;s Digital Garden</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
          Technical Notes &amp;{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Engineering Wiki
          </span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Living documentation, architectural write-ups, IoT cheatsheets, and production DevOps lessons
          learned shipping modern web and embedded hardware systems.
        </p>

        {/* Global Search Bar & Trigger */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-500/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3 text-neutral-400 text-sm">
              <Search className="w-4 h-4 text-neutral-400" />
              <span>Search all articles and guides...</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          All Topics ({articles.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.slug
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {cat.name}
            {cat.articleCount !== undefined && ` (${cat.articleCount})`}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            No articles found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Link
                key={article.id}
                href={`/wiki/${article.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  {/* Category & Reading Time */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                    {article.category && (
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {article.category.name}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readingTimeMinutes} min read</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug mb-2.5">
                    {article.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6">
                    {article.summary}
                  </p>
                </div>

                {/* Footer with Date & Read Link */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800/60 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
