'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  adminCreateProject,
  adminUpdateProject,
  adminGetProject,
} from '@/lib/admin-api';

interface ProjectEditorProps {
  projectId?: string;
}

export function ProjectEditor({ projectId }: ProjectEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [keyFeatureInput, setKeyFeatureInput] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    category: 'Full-Stack Web',
    thumbnailUrl: '/projects/custom.jpg',
    liveDemoUrl: '',
    repoUrl: '',
    isFeatured: true,
    displayOrder: 1,
    caseStudy: {
      overview: '',
      architecture: '',
      challenges: '',
      keyFeatures: [] as string[],
      results: '',
    },
  });

  useEffect(() => {
    if (isEdit && projectId) {
      adminGetProject(projectId)
        .then((p) => {
          setForm({
            title: p.title || '',
            slug: p.slug || '',
            summary: p.summary || '',
            category: p.category || 'Full-Stack Web',
            thumbnailUrl: p.thumbnailUrl || '',
            liveDemoUrl: p.liveDemoUrl || '',
            repoUrl: p.repoUrl || '',
            isFeatured: p.isFeatured ?? true,
            displayOrder: p.displayOrder ?? 1,
            caseStudy: {
              overview: p.caseStudy?.overview || '',
              architecture: p.caseStudy?.architecture || '',
              challenges: p.caseStudy?.challenges || '',
              keyFeatures: p.caseStudy?.keyFeatures || [],
              results: p.caseStudy?.results || '',
            },
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(`Failed to load project: ${err.message}`);
          setLoading(false);
        });
    }
  }, [projectId, isEdit]);

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

  const handleAddFeature = () => {
    if (!keyFeatureInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      caseStudy: {
        ...prev.caseStudy,
        keyFeatures: [...prev.caseStudy.keyFeatures, keyFeatureInput.trim()],
      },
    }));
    setKeyFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      caseStudy: {
        ...prev.caseStudy,
        keyFeatures: prev.caseStudy.keyFeatures.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatusMessage(null);

    try {
      if (isEdit && projectId) {
        await adminUpdateProject(projectId, form);
        setStatusMessage('Project updated and live cache purged!');
      } else {
        await adminCreateProject(form);
        setStatusMessage('Project created successfully!');
        setTimeout(() => router.push('/admin/projects'), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex items-center justify-center gap-2 text-neutral-500">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span>Loading project details...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              {isEdit ? 'Edit Case Study & Project' : 'Add New Project'}
            </h1>
            <p className="text-xs text-neutral-500">
              {isEdit ? `Updating /projects/${form.slug}` : 'Creates a new case study on dekakrens.com'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Create Project'}</span>
            </>
          )}
        </button>
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

      {/* Main Details */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          General Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Real-Time Telemetry Dashboard"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="IoT & Edge AI, Full-Stack Web, Mobile & Health IoT..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              placeholder="https://github.com/dekakrens/..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Live Demo URL
            </label>
            <input
              type="text"
              value={form.liveDemoUrl}
              onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Elevator Pitch / Summary
            </label>
            <textarea
              rows={2}
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Case Study Deep Dive */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Case Study Narrative &amp; Highlights
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              System Architecture &amp; Implementation Details
            </label>
            <textarea
              rows={3}
              value={form.caseStudy.architecture}
              onChange={(e) =>
                setForm({
                  ...form,
                  caseStudy: { ...form.caseStudy, architecture: e.target.value },
                })
              }
              placeholder="Detailed tech breakdown (e.g. NestJS microservices, Redis queues, Docker orchestration)..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Key Engineering Challenges Overcome
            </label>
            <textarea
              rows={2}
              value={form.caseStudy.challenges}
              onChange={(e) =>
                setForm({
                  ...form,
                  caseStudy: { ...form.caseStudy, challenges: e.target.value },
                })
              }
              placeholder="How memory leaks or packet latency issues were mitigated..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Results &amp; Impact
            </label>
            <textarea
              rows={2}
              value={form.caseStudy.results}
              onChange={(e) =>
                setForm({
                  ...form,
                  caseStudy: { ...form.caseStudy, results: e.target.value },
                })
              }
              placeholder="e.g. Achieved 99.2% accuracy across 500+ real-world captures in production..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Key Features Bullet List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Key Feature Bullets
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={keyFeatureInput}
                onChange={(e) => setKeyFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add bullet item (e.g. Sub-5 second wake-capture-sleep lifecycle)..."
                className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {form.caseStudy.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between text-xs"
                >
                  <span className="text-neutral-700 dark:text-neutral-300">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
