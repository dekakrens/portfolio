'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react';
import {
  adminGetExperiences,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
} from '@/lib/admin-api';

interface Experience {
  id: string;
  companyName: string;
  companyUrl?: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  displayOrder: number;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<{
    id?: string;
    companyName: string;
    companyUrl: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    highlights: string[];
    displayOrder: number;
  } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminGetExperiences();
      setExperiences(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load experiences' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp({
        id: exp.id,
        companyName: exp.companyName,
        companyUrl: exp.companyUrl || '',
        role: exp.role,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description,
        highlights: exp.highlights && exp.highlights.length > 0 ? [...exp.highlights] : [''],
        displayOrder: exp.displayOrder,
      });
    } else {
      setEditingExp({
        companyName: '',
        companyUrl: '',
        role: '',
        location: 'Remote / Indonesia',
        startDate: '',
        endDate: 'Present',
        isCurrent: true,
        description: '',
        highlights: [''],
        displayOrder: experiences.length,
      });
    }
    setShowModal(true);
  };

  const handleHighlightChange = (index: number, val: string) => {
    if (!editingExp) return;
    const updated = [...editingExp.highlights];
    updated[index] = val;
    setEditingExp({ ...editingExp, highlights: updated });
  };

  const handleAddHighlight = () => {
    if (!editingExp) return;
    setEditingExp({ ...editingExp, highlights: [...editingExp.highlights, ''] });
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      highlights: editingExp.highlights.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.companyName || !editingExp.role) return;

    try {
      setSaving(true);
      const cleanHighlights = editingExp.highlights.map((h) => h.trim()).filter(Boolean);

      const payload = {
        companyName: editingExp.companyName,
        companyUrl: editingExp.companyUrl || undefined,
        role: editingExp.role,
        location: editingExp.location,
        startDate: editingExp.startDate,
        endDate: editingExp.isCurrent ? 'Present' : editingExp.endDate,
        isCurrent: editingExp.isCurrent,
        description: editingExp.description,
        highlights: cleanHighlights,
        displayOrder: editingExp.displayOrder,
      };

      if (editingExp.id) {
        await adminUpdateExperience(editingExp.id, payload);
        setMessage({ type: 'success', text: 'Experience updated and cache revalidated' });
      } else {
        await adminCreateExperience(payload);
        setMessage({ type: 'success', text: 'New experience added and cache revalidated' });
      }

      setShowModal(false);
      setEditingExp(null);
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save experience' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, role: string, company: string) => {
    if (!confirm(`Are you sure you want to remove "${role} at ${company}"?`)) return;
    try {
      await adminDeleteExperience(id);
      setMessage({ type: 'success', text: 'Experience removed successfully' });
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete experience' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-500" />
            Career Journey &amp; Experience
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your employment history, roles, key achievements, and timeline on your homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
          <a
            href="https://dekakrens.com#experience"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm">Loading career journey...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="p-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <Briefcase className="w-10 h-10 text-neutral-400 mb-2" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">No experiences recorded</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mb-4">
            Click "Add Experience" to list your work history and positions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {exp.role}
                    </h2>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-emerald-500" />
                      {exp.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} – {exp.endDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => handleOpenModal(exp)}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Edit Experience"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.role, exp.companyName)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-950/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description & Bullet points */}
              <div className="mt-4 space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1.5 pl-4 border-l-2 border-emerald-500/30 mt-3">
                    {exp.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience Modal */}
      {showModal && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                {editingExp.id ? 'Edit Career Position' : 'Add New Position'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Front End & Mobile Developer"
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meetaza Prawira Media"
                    value={editingExp.companyName}
                    onChange={(e) => setEditingExp({ ...editingExp, companyName: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Company Website (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={editingExp.companyUrl}
                    onChange={(e) => setEditingExp({ ...editingExp, companyUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Bandung, Indonesia"
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oct 2021"
                    value={editingExp.startDate}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Present or Sep 2021"
                    disabled={editingExp.isCurrent}
                    value={editingExp.isCurrent ? 'Present' : editingExp.endDate}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      checked={editingExp.isCurrent}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? 'Present' : '',
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Currently work here</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Overview / Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize your role and impact..."
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Achievements / Highlights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Key Highlights &amp; Accomplishments
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingExp.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-400 w-4">{i + 1}.</span>
                      <input
                        type="text"
                        placeholder="e.g. Engineered GPS tracking system reducing latency by 40%..."
                        value={h}
                        onChange={(e) => handleHighlightChange(i, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {editingExp.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(i)}
                          className="p-1 text-neutral-400 hover:text-rose-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
