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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title="Create Account" />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-[480px] mx-auto w-full flex flex-col">
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-on-surface mb-2">Join Nilingua</h1>
          <p className="text-on-surface-variant">Start your language learning adventure today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-bold text-outline capitalize tracking-widest px-1">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
              <input 
                type="text" 
                placeholder="Your name"
                className="w-full h-14 pl-12 pr-4 bg-white border-1 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-outline capitalize tracking-widest px-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full h-14 pl-12 pr-4 bg-white border-1 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-outline capitalize tracking-widest px-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
              <input 
                type="password" 
                placeholder="Create a password"
                className="w-full h-14 pl-12 pr-4 bg-white border-1 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="tactile-button-primary w-full h-14 mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-on-surface-variant mb-6 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
            OR REGISTER WITH
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="tactile-card h-14 flex items-center justify-center gap-3">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="Google" />
              <span className="font-bold text-on-surface">Google</span>
            </button>
            <button className="tactile-card h-14 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-on-surface">social_leaderboard</span>
              <span className="font-bold text-on-surface">Other</span>
            </button>
          </div>

          <p className="mt-5 text-on-surface-variant text-sm">
            By joining, you agree to our <Link href="#" className="text-primary font-bold">Terms</Link> and <Link href="#" className="text-primary font-bold">Privacy Policy</Link>.
          </p>

          <p className="mt-2 text-on-surface-variant">
            Already have an account? <Link href="/login" className="text-primary font-bold">Log In</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
