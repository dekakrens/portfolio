'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FolderKanban,
  Mail,
  Cpu,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { adminGetStats, adminGetInquiries } from '@/lib/admin-api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalProjects: 0,
    totalInquiries: 0,
    totalSkills: 0,
  });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetInquiries()])
      .then(([statsData, inquiriesData]) => {
        setStats(statsData);
        setInquiries(inquiriesData.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      label: 'Wiki Articles',
      value: stats.totalArticles,
      icon: BookOpen,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      href: '/admin/wiki',
    },
    {
      label: 'Selected Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      href: '/admin/projects',
    },
    {
      label: 'Contact Inquiries',
      value: stats.totalInquiries,
      icon: Mail,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      href: '/admin/inquiries',
    },
    {
      label: 'Skills Populated',
      value: stats.totalSkills,
      icon: Cpu,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      href: '/#skills',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-2">
            Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Deny!
          </h1>
          <p className="text-sm text-neutral-300 mt-1 max-w-xl">
            Manage your articles on <code className="text-emerald-400">wiki.dekakrens.com</code>, update project case studies, and respond to incoming inquiries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/wiki/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {loading ? '...' : c.value}
                </div>
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                  {c.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Recent Inquiries
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Messages received from your portfolio contact form
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No inquiries received yet.
            </div>
          ) : (
            inquiries.map((inq) => (
              <div key={inq.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">
                      {inq.name}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      &lt;{inq.email}&gt;
                    </span>
                  </div>
                  <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Subject: {inq.subject || '(No subject)'}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {inq.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Portfolio Inquiry')}`}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Reply
                  </a>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
