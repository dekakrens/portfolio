'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  adminCreateArticle,
  adminUpdateArticle,
  adminGetArticle,
  adminGetWikiCategories,
} from '@/lib/admin-api';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface ArticleEditorProps {
  articleId?: string; // If undefined, mode is 'create'
}

export function ArticleEditor({ articleId }: ArticleEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(articleId);

  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    categoryId: '',
    summary: '',
    readingTimeMinutes: 5,
    status: 'published',
    content: `# New Engineering Note\n\nWrite your markdown content here...`,
  });

  useEffect(() => {
    adminGetWikiCategories()
      .then((cats) => {
        setCategories(cats);
        if (!isEdit && cats.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      })
      .catch(console.error);

    if (isEdit && articleId) {
      adminGetArticle(articleId)
        .then((art) => {
          setForm({
            title: art.title,
            slug: art.slug,
            categoryId: art.categoryId || '',
            summary: art.summary || '',
            readingTimeMinutes: art.readingTimeMinutes || 5,
            status: art.status || 'published',
            content: art.content || '',
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to load article: ${err.message}`);
          setLoading(false);
        });
    }
  }, [articleId, isEdit]);

  const handleTitleChange = (val: string) => {
    setForm((prev) => {
      const next = { ...prev, title: val };
      if (!isEdit) {
        next.slug = val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatusMessage(null);

    try {
      if (isEdit && articleId) {
        await adminUpdateArticle(articleId, form);
        setStatusMessage('Article updated and cache purged live!');
      } else {
        await adminCreateArticle(form);
        setStatusMessage('Article published and cache purged live!');
        setTimeout(() => {
          router.push('/admin/wiki');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex items-center justify-center gap-2 text-neutral-500">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span>Loading article editor...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/wiki"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              {isEdit ? 'Edit Article' : 'Write New Article'}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEdit ? `Updating /wiki/${form.slug}` : 'Creates a new entry on dekakrens.com/wiki'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {activeTab === 'editor' ? (
              <>
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>Live Preview</span>
              </>
            ) : (
              <>
                <Code className="w-4 h-4 text-indigo-500" />
                <span>Edit Markdown</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Save Changes' : 'Publish Article'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Article Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Deploying Next.js 15 Standalone Containers on ARM64"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="deploying-nextjs-arm64"
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            Topic Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            Estimated Reading Time (Minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={form.readingTimeMinutes}
            onChange={(e) =>
              setForm({ ...form, readingTimeMinutes: parseInt(e.target.value, 10) || 5 })
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            Publication Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="published">Published (Visible Live)</option>
            <option value="draft">Draft (Admin Only)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
            Summary / Meta Description
          </label>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="A concise summary for search engine optimization and preview cards..."
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between text-xs">
          <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <span>Markdown Content</span>
            <span className="text-[10px] text-neutral-400">
              (Supports GitHub-flavored markdown, code blocks, and callouts)
            </span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {activeTab === 'editor' ? (
          <textarea
            rows={22}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full p-6 bg-transparent text-sm font-mono leading-relaxed focus:outline-none resize-y"
            placeholder="Type your markdown here..."
          />
        ) : (
          <div className="p-8 max-w-4xl mx-auto">
            <MarkdownRenderer content={form.content} />
          </div>
        )}
      </div>
    </form>
  );
}
