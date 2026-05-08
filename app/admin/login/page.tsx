/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setToastVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      router.push('/admin');
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_44%,rgba(241,243,249,1)_100%)]">
      <TopBar showBack onBack={() => router.back()} title="Admin Login" />

      {toastVisible && (
        <div className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-[0_16px_40px_rgba(38,65,145,0.16)]">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em]">Success</p>
            <p className="text-sm leading-6">Admin login successful. Redirecting to the dashboard.</p>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-6 pb-12 pt-24">
        <div className="grid w-full max-w-[1180px] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[28px] border border-outline-variant bg-white p-8 shadow-[0_16px_40px_rgba(38,65,145,0.08)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-primary">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              Admin access
            </div>

            <h1 className="mt-6 text-[34px] font-semibold tracking-[-0.06em] text-on-surface">
              Welcome back, admin.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">
              Sign in to manage lessons, quizzes, and learner progress from one clean workspace.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-surface px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Lessons</p>
                <p className="mt-2 text-lg font-semibold text-on-surface">Builder</p>
              </article>
              <article className="rounded-2xl bg-surface px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Quizzes</p>
                <p className="mt-2 text-lg font-semibold text-on-surface">Review</p>
              </article>
              <article className="rounded-2xl bg-surface px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Progress</p>
                <p className="mt-2 text-lg font-semibold text-on-surface">Track</p>
              </article>
            </div>
          </section>

          <section className="rounded-[28px] border border-outline-variant bg-white p-8 shadow-[0_16px_40px_rgba(38,65,145,0.08)]">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/65">Admin Sign In</p>
              <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.05em] text-on-surface">Login to dashboard</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Use your admin credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="px-1 text-sm font-bold uppercase tracking-widest text-outline">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    className="h-14 w-full rounded-xl border border-outline-variant bg-white pl-12 pr-4 font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-bold uppercase tracking-widest text-outline">Password</label>
                  <Link href="#" className="text-xs font-bold text-primary">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    lock
                  </span>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-xl border border-outline-variant bg-white pl-12 pr-4 font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
