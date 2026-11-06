'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Mail,
  User,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Cpu,
  Briefcase,
  MessageSquareQuote,
} from 'lucide-react';
import { getAuthToken, removeAuthToken, adminGetMe } from '@/lib/admin-api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    adminGetMe()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        removeAuthToken();
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-sm">Verifying CMS authentication...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Wiki Articles', href: '/admin/wiki', icon: BookOpen },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Skills & Stack', href: '/admin/skills', icon: Cpu },
    { label: 'Career Journey', href: '/admin/experience', icon: Briefcase },
    { label: 'Feedbacks', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { label: 'Profile & Cards', href: '/admin/profile', icon: User },
  ];

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-extrabold flex items-center justify-center text-base shadow-sm">
              DK
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                Deny Kurniawan
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                CMS Dashboard
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & Actions */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <a
            href="https://dekakrens.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Admin Portal
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Authenticated as {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/wiki/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <span>+ New Article</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
