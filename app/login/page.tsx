/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title="Login" />
      
      <main className="flex-1 pt-24 pb-12 px-6 max-w-[480px] mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome Back!</h1>
          <p className="text-on-surface-variant">Continue your journey to mastery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-outline uppercase tracking-widest px-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-outline uppercase tracking-widest">Password</label>
              <Link href="#" className="text-xs font-bold text-primary">Forgot?</Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
              <input 
                type="password" 
                placeholder="Enter your password"
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-outline-variant rounded-xl focus:border-primary outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="tactile-button-primary w-full h-14 text-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-on-surface-variant mb-6 flex items-center justify-center gap-4">
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
            OR
            <span className="h-[1px] flex-1 bg-outline-variant"></span>
          </p>
          
          <button className="tactile-card w-full h-14 flex items-center justify-center gap-3 mb-8">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="Google" />
            <span className="font-bold text-on-surface">Continue with Google</span>
          </button>

          <p className="text-on-surface-variant">
            Don't have an account? <Link href="/register" className="text-primary font-bold">Register Now</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
