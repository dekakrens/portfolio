'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  User,
  Inbox,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { adminGetInquiries, adminDeleteInquiry } from '@/lib/admin-api';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await adminGetInquiries();
      setInquiries(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load inquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the message from "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await adminDeleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      setMessage({ type: 'success', text: 'Inquiry deleted successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete inquiry' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.subject && inq.subject.toLowerCase().includes(q)) ||
      (inq.message && inq.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-500" />
            Contact Inquiries
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Read and manage client submissions from your portfolio contact form.
          </p>
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          Total messages: <span className="font-semibold text-neutral-900 dark:text-white">{inquiries.length}</span>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by sender name, email, subject, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Inquiries Content: Split List and Viewer */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm">Loading contact inquiries...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">No inquiries found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm">
            {search ? 'Try adjusting your search criteria.' : 'When someone sends a message via your portfolio contact form, it will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List column */}
          <div className="lg:col-span-5 space-y-3">
            {filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
                      {inq.name}
                    </div>
                    <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {inq.email}
                  </div>

                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate mt-2">
                    {inq.subject || '(No subject)'}
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                    {inq.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Details / Preview column */}
          <div className="lg:col-span-7 sticky top-6">
            {selectedInquiry ? (
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-6">
                {/* Actions & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {selectedInquiry.subject || '(No subject)'}
                    </h2>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(selectedInquiry.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                        `Re: ${selectedInquiry.subject || 'Portfolio Inquiry'}`
                      )}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Reply via Email
                    </a>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                      disabled={deletingId === selectedInquiry.id}
                      className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete inquiry"
                    >
                      {deletingId === selectedInquiry.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sender Info */}
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {selectedInquiry.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {selectedInquiry.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Message Body
                  </h3>
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-sans">
                    {selectedInquiry.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center text-neutral-400">
                <Mail className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">Select an inquiry from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
