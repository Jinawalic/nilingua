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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToastVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">

      {toastVisible && (
        <div className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em]">Success</p>
            <p className="text-sm leading-6">Admin login successful. Redirecting to the dashboard.</p>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-6 pb-12 pt-10">
        <div className="grid w-full max-w-[1180px] grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
         
          <section className="rounded-[28px] border border-outline-variant bg-white p-8">
            <div className="mb-6">
              <h2 className="text-[22px] font-semibold tracking-[-0.05em] text-on-surface">Admin Login</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                Use your admin credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="px-1 text-sm font-bold capitalize text-outline">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-xl border border-outline-variant bg-white pl-12 pr-4 font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-bold capitalize text-outline">Password</label>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-xl border border-outline-variant bg-white pl-12 pr-4 font-medium text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

                {error && (
                  <p className="text-sm font-medium text-red-600 text-center">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
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
