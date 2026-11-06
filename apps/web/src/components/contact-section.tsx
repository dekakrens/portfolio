'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Clock, MapPin } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFeedback(data.message || 'Thank you for reaching out! I will respond promptly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to deliver message. Please try again or email directly.');
      }
    } catch {
      setStatus('error');
      setFeedback('An error occurred. Please reach out via email directly.');
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-neutral-200/80 dark:border-neutral-800/80 section-deferred">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
            Let&apos;s Build Something Great
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
            Have a project in mind, need architecture consulting, or looking to discuss full-stack &amp; IoT solutions? Send a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Info Card */}
          <div className="scroll-reveal md:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/60 space-y-4">
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                Direct Contact
              </h3>

              <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">Email</div>
                  <a
                    href="mailto:dekakrens@gmail.com"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    dekakrens@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">Location</div>
                  <div>Indonesia (UTC+7 / UTC+8) • Remote Worldwide</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">Response Time</div>
                  <div>Typically within 24 hours</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                Decoupled Architecture
              </span>
              Inquiries are validated and processed through the dedicated NestJS backend API with schema-backed persistence in PostgreSQL.
            </div>
          </div>

          {/* Form */}
          <div className="scroll-reveal md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm space-y-4"
            >
              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-800 dark:text-red-300 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="New Project Inquiry / IoT Consulting"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me a bit about what you're looking to build..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
