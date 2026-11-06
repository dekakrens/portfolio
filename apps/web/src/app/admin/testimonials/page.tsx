'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  User,
  Quote,
  Building,
} from 'lucide-react';
import {
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '@/lib/admin-api';

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string;
  company?: string;
  content: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  displayOrder: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id?: string;
    authorName: string;
    authorTitle: string;
    company: string;
    content: string;
    avatarUrl: string;
    linkedinUrl: string;
    displayOrder: number;
  } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminGetTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load feedbacks' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem({
        id: item.id,
        authorName: item.authorName,
        authorTitle: item.authorTitle,
        company: item.company || '',
        content: item.content,
        avatarUrl: item.avatarUrl || '',
        linkedinUrl: item.linkedinUrl || '',
        displayOrder: item.displayOrder,
      });
    } else {
      setEditingItem({
        authorName: '',
        authorTitle: '',
        company: '',
        content: '',
        avatarUrl: '',
        linkedinUrl: '',
        displayOrder: testimonials.length,
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.authorName || !editingItem.content) return;

    try {
      setSaving(true);
      const payload = {
        authorName: editingItem.authorName,
        authorTitle: editingItem.authorTitle,
        company: editingItem.company || undefined,
        content: editingItem.content,
        avatarUrl: editingItem.avatarUrl || undefined,
        linkedinUrl: editingItem.linkedinUrl || undefined,
        displayOrder: editingItem.displayOrder,
      };

      if (editingItem.id) {
        await adminUpdateTestimonial(editingItem.id, payload);
        setMessage({ type: 'success', text: 'Feedback updated and cache revalidated' });
      } else {
        await adminCreateTestimonial(payload);
        setMessage({ type: 'success', text: 'New feedback added and cache revalidated' });
      }

      setShowModal(false);
      setEditingItem(null);
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save feedback' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove feedback from "${name}"?`)) return;
    try {
      await adminDeleteTestimonial(id);
      setMessage({ type: 'success', text: 'Feedback removed successfully' });
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete feedback' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-emerald-500" />
            Client Feedbacks &amp; Endorsements
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage peer endorsements, client reviews, and testimonials displayed on your homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feedback</span>
          </button>
          <a
            href="https://dekakrens.com#testimonials"
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

      {/* Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm">Loading feedbacks...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <MessageSquareQuote className="w-10 h-10 text-neutral-400 mb-2" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">No feedbacks recorded</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mb-4">
            Click "Add Feedback" to highlight client quotes and recommendations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
            >
              {/* Top Quote */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Quote className="w-6 h-6 text-emerald-500/40" />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Edit Feedback"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.authorName)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.authorName} className="w-full h-full object-cover" />
                  ) : (
                    t.authorName.slice(0, 2).toUpperCase()
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {t.authorName}
                  </div>
                  <div className="text-xs text-neutral-500 truncate">
                    {t.authorTitle}
                    {t.company ? ` • ${t.company}` : ''}
                  </div>
                </div>

                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Modal */}
      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-emerald-500" />
                {editingItem.id ? 'Edit Feedback' : 'Add New Feedback'}
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
                    Author Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={editingItem.authorName}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, authorName: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead IoT Engineer"
                    value={editingItem.authorTitle}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, authorTitle: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Company Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Telematics Labs"
                    value={editingItem.company}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, company: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.displayOrder}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Feedback Quote / Recommendation
                </label>
                <textarea
                  rows={4}
                  placeholder="Deny is a reliable engineer with exceptional frontend and hardware integration skills..."
                  value={editingItem.content}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, content: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Avatar Image URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingItem.avatarUrl}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, avatarUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    LinkedIn Profile URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={editingItem.linkedinUrl}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
