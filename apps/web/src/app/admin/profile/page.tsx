'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Briefcase,
  Share2,
} from 'lucide-react';
import { adminGetProfile, adminUpdateProfile } from '@/lib/admin-api';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bioShort: '',
    bioLong: '',
    availabilityBadge: '',
    resumeAssetUrl: '',
    socialLinks: {
      github: '',
      linkedin: '',
      email: '',
      twitter: '',
    },
  });

  useEffect(() => {
    adminGetProfile()
      .then((data) => {
        if (data) {
          setFormData({
            fullName: data.fullName || '',
            headline: data.headline || '',
            bioShort: data.bioShort || '',
            bioLong: data.bioLong || '',
            availabilityBadge: data.availabilityBadge || '',
            resumeAssetUrl: data.resumeAssetUrl || '',
            socialLinks: {
              github: data.socialLinks?.github || '',
              linkedin: data.socialLinks?.linkedin || '',
              email: data.socialLinks?.email || '',
              twitter: data.socialLinks?.twitter || '',
            },
          });
        }
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message || 'Failed to load profile' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await adminUpdateProfile(formData);
      setMessage({
        type: 'success',
        text: 'Profile updated and live cache automatically revalidated!',
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-500" />
            Profile & Bio Settings
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Update your public profile, hero headline, bio, and social handles across the site.
          </p>
        </div>
        <a
          href="https://dekakrens.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline self-start sm:self-auto"
        >
          View live portfolio <ExternalLink className="w-3.5 h-3.5" />
        </a>
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Identity */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Briefcase className="w-4 h-4 text-emerald-500" />
            Personal & Hero Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Availability Status Badge
              </label>
              <input
                type="text"
                placeholder="e.g. Open to Opportunities"
                value={formData.availabilityBadge}
                onChange={(e) => handleChange('availabilityBadge', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Short Bio (Homepage Hero)
            </label>
            <textarea
              rows={3}
              value={formData.bioShort}
              onChange={(e) => handleChange('bioShort', e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Extended Bio / About (Markdown supported)
            </label>
            <textarea
              rows={6}
              value={formData.bioLong}
              onChange={(e) => handleChange('bioLong', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Assets & Links */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <FileText className="w-4 h-4 text-emerald-500" />
            Resume & Document Assets
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Resume Asset Path or URL
            </label>
            <input
              type="text"
              placeholder="/Deny_Kurniawan-Resume.pdf"
              value={formData.resumeAssetUrl}
              onChange={(e) => handleChange('resumeAssetUrl', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Path relative to web public directory or an external secure URL.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Share2 className="w-4 h-4 text-emerald-500" />
            Social Profiles & Contact Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/dekakrens"
                value={formData.socialLinks.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/dekakrens"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="dekakrens@gmail.com"
                value={formData.socialLinks.email}
                onChange={(e) => handleSocialChange('email', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                placeholder="https://x.com/dekakrens"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile & Revalidate Cache
          </button>
        </div>
      </form>
    </div>
  );
}
