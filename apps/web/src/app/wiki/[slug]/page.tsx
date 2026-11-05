import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { getWikiArticles, getWikiArticleBySlug } from '@/lib/wiki-api';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { WikiToc } from '@/components/wiki-toc';

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getWikiArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getWikiArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Deny Kurniawan Wiki',
    };
  }

  const title = `${article.title} | Deny Kurniawan Engineering Wiki`;
  const description = article.summary || 'Technical guide and architectural article by Deny Kurniawan.';

  return {
    title,
    description,
    authors: [{ name: 'Deny Kurniawan', url: 'https://dekakrens.com' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://wiki.dekakrens.com/${article.slug}`,
      publishedTime: article.publishedAt,
    },
    alternates: {
      canonical: `https://wiki.dekakrens.com/${article.slug}`,
    },
  };
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getWikiArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.summary,
    author: {
      '@type': 'Person',
      name: 'Deny Kurniawan',
      alternateName: 'dekakrens',
      url: 'https://dekakrens.com',
    },
    datePublished: article.publishedAt,
    publisher: {
      '@type': 'Person',
      name: 'Deny Kurniawan',
      url: 'https://dekakrens.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://wiki.dekakrens.com/${article.slug}`,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* JSON-LD Structured Data for Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        <Link
          href="/"
          className="hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          href="/wiki"
          className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Wiki</span>
        </Link>
        {article.category && (
          <>
            <span>/</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
              {article.category.name}
            </span>
          </>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Article Content Column */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Article Header */}
          <header className="mb-10 pb-8 border-b border-neutral-200 dark:border-neutral-800">
            {article.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 mb-4">
                {article.category.name}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15] mb-6">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 font-normal">
                {article.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Published on {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{article.readingTimeMinutes} min read</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                <span>By Deny Kurniawan (@dekakrens)</span>
              </div>
            </div>
          </header>

          {/* Rendered Markdown Content */}
          <div className="wiki-content">
            <MarkdownRenderer content={article.content} />
          </div>

          {/* Footer Navigation */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <Link
              href="/wiki"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Wiki</span>
            </Link>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title,
              )}&url=${encodeURIComponent(`https://wiki.dekakrens.com/${article.slug}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on X</span>
            </a>
          </div>
        </div>

        {/* Sticky Table of Contents Sidebar */}
        <WikiToc content={article.content} />
      </div>
    </div>
  );
}
