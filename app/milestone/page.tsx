/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function MilestonePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Lesson Complete!" />

      <main className="pt-24 pb-22 px-5 flex-1 max-w-[480px] mx-auto flex flex-col items-center w-full">
        <div className="w-full text-center mb-3 relative z-10">
          <div className="mb-3 flex justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-surface-variant" cx="52" cy="52" fill="transparent" r="42" stroke="currentColor" strokeWidth="12"></circle>
                <circle className="text-primary-container" cx="52" cy="52" fill="transparent" r="42" stroke="currentColor" strokeDasharray="300.52" strokeDashoffset="110.58" strokeLinecap="round" strokeWidth="12"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-primary leading-none">80%</span>
                <span className="text-[8px] font-bold text-outline-variant uppercase tracking-widest mt-1">Mastery</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Excellent!</h1>
          <p className="text-on-surface-variant font-medium">You're mastering Yoruba.</p>
        </div>

        <div className="w-full mb-3 relative">
          <div className="bg-white rounded-3xl p-6 border-2 border-outline-variant shadow-sm flex flex-col items-center tactile-card">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>
            <span className="text-xl font-bold text-on-surface">New Milestone!</span>
            <p className="text-on-surface-variant text-sm text-center">You've completed 5 Yoruba lessons this week.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          <div className="bg-white p-5 rounded-2xl border-2 border-outline-variant flex flex-col items-center text-center tactile-card">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <span className="text-2xl font-bold text-on-surface">+20</span>
            </div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">XP Earned</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border-2 border-outline-variant flex flex-col items-center text-center tactile-card">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-blue-500">schedule</span>
              </div>
              <span className="text-2xl font-bold text-on-surface">2:30</span>
            </div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Time Spent</span>
          </div>
        </div>

        <div className="w-full space-y-4 mt-auto">
          <button
            onClick={() => router.push('/home')}
            className="tactile-button-primary w-full h-14 flex items-center justify-center gap-2"
          >
            Finish & Continue
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            onClick={() => router.push('/quiz')}
            className="tactile-button-secondary w-full h-14 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">history</span>
            Review Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
