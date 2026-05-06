/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export default function VocabPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  const options = ['Ile', 'Ona', 'Omi', 'Oko'];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title="Vocabulary" />
      
      <main className="flex-grow pt-24 pb-32 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-on-surface">Translate this word</h1>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-primary text-4xl">volume_up</span>
            <span className="text-2xl font-bold text-primary">"House"</span>
          </div>
        </div>

        <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-md">
          <img 
            alt="Traditional House" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD3kruqqfE6oZGkZo539TdzHc_oEaFcGwTlSdMey0q_BEQv5L36akhsCYMlUsPUNoMtNSCu9Kxz0SAiuRoK95IeAYobeLZYyPG1e94ryxF5-OkEQWcD8lTVvscVsS3WgOBxd0IjlwR1sUSpXgfg6ThdsfTXkzxPwA1kHTuL86lwCy9UNiZb0hoJGdZfZg1oRnwmB09xo3UBucd6qhgnVo3a1U6owUb39_D6ORkJRfqsUkgqsciOkLmi5kuukGbuhD3K2a74X2wC7w" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => setSelected(i)}
              className={`p-6 rounded-2xl border-2 transition-all duration-100 flex flex-col items-center justify-center ${
                selected === i 
                  ? 'border-primary-container bg-primary/5 shadow-[0_2px_0_0_#006e2f] translate-y-[2px]' 
                  : 'bg-white border-outline-variant shadow-[0_4px_0_0_#dce5d9] active:translate-y-[4px] active:shadow-none'
              }`}
            >
              <div className="w-full text-left mb-2 text-outline text-[10px] font-bold uppercase tracking-widest opacity-60">
                {i + 1}
              </div>
              <span className="text-xl font-bold">{opt}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t-2 border-outline-variant p-5 z-50">

        <div className="max-w-[480px] mx-auto">
          <button 
            disabled={selected === null}
            onClick={() => router.push('/lessons')}
            className={`tactile-button-primary w-full h-14 flex items-center justify-center gap-2 ${selected === null ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          >
            Check
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
