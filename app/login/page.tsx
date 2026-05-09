/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to log in');
      }

      router.push('/home');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title="Login" />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-[480px] mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-on-surface mb-2">Welcome Back!</h1>
          <p className="text-on-surface-variant">Continue your journey to mastery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-outline capitalize tracking-widest px-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-white border-1 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-outline capitalize tracking-widest">Password</label>
              <Link href="#" className="text-xs font-bold text-primary">Forgot?</Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-white border-1 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium text-on-surface placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="tactile-button-primary w-full h-14 text-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              'Login'
            )}
          </button>
          {error ? <p className="text-sm font-medium text-red-600 text-center">{error}</p> : null}
        </form>

        <div className="mt-5 text-center">
          <p className="text-on-surface-variant mb-6 flex items-center justify-center gap-4">
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
            OR
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
          </p>
          
          <button className="tactile-card w-full h-14 flex items-center justify-center gap-3 mb-6">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="Google" />
            <span className="font-bold text-on-surface">Continue with Google</span>
          </button>

          <p className="text-on-surface-variant">
            Don&apos;t have an account? <Link href="/register" className="text-primary font-bold">Register Now</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
