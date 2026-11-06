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
    highlights: [
      { icon: 'Layers', title: '6+ Years', subtitle: 'Full-Stack Experience' },
      { icon: 'Cpu', title: 'Edge & IoT', subtitle: 'ESP32 / OpenCV / LoRa' },
      { icon: 'Terminal', title: 'Enterprise', subtitle: 'NestJS & Drizzle ORM' },
      { icon: 'Sparkles', title: '99.2%', subtitle: 'Vision OCR Accuracy' },
    ],
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
            highlights:
              data.highlights && data.highlights.length > 0
                ? data.highlights
                : [
                    { icon: 'Layers', title: '6+ Years', subtitle: 'Full-Stack Experience' },
                    { icon: 'Cpu', title: 'Edge & IoT', subtitle: 'ESP32 / OpenCV / LoRa' },
                    { icon: 'Terminal', title: 'Enterprise', subtitle: 'NestJS & Drizzle ORM' },
                    { icon: 'Sparkles', title: '99.2%', subtitle: 'Vision OCR Accuracy' },
                  ],
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

  const handleHighlightChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, highlights: updated };
    });
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

        {/* Hero Highlight Cards */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-4">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                Hero Highlight Cards (Below Social Links)
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                The 4 metric/highlight cards shown directly beneath your social links on the homepage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(formData.highlights || []).map((hl, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400">Card #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-neutral-400">Icon:</label>
                    <select
                      value={hl.icon || 'Layers'}
                      onChange={(e) => handleHighlightChange(idx, 'icon', e.target.value)}
                      className="px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none"
                    >
                      <option value="Layers">Layers</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Code">Code</option>
                      <option value="Award">Award</option>
                      <option value="Zap">Zap</option>
                      <option value="Globe">Globe</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Value / Heading
                  </label>
                  <input
                    type="text"
                    value={hl.title}
                    onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                    placeholder="e.g. 6+ Years"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={hl.subtitle}
                    onChange={(e) => handleHighlightChange(idx, 'subtitle', e.target.value)}
                    placeholder="e.g. Full-Stack Experience"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ))}
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
