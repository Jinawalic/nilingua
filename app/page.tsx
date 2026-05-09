/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Landing() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,250,255,0.96)_40%,_rgba(226,232,240,0.95)_100%)]" />
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-primary rounded-2xl animate-pulse flex items-center justify-center">
            <span className="text-4xl">🇳🇬</span>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-8 bg-surface-container-low rounded-lg animate-pulse w-48 mx-auto" />
            <div className="h-4 bg-surface-container-low rounded-lg animate-pulse w-64 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,250,255,0.96)_40%,_rgba(226,232,240,0.95)_100%)]" />
      <div className="relative pt-1 pb-2 px-2 max-w-[480px] mx-auto overflow-x-hidden flex flex-col items-center">
        <section className="flex flex-col items-center text-center mb-2">
          <div className="relative w-full aspect-square max-w-[480px] mb-2">
            {/* <img 
                    alt="Nilingua Mascot" 
                    className="w-full h-full object-cover bg-primary/10 rounded-2xl overlay-slate-100/50" 
              src="/images/welcome-img.png" 
            /> */}
            <video src="/images/culture-vid.mp4" autoPlay muted loop className="w-full h-full object-cover bg-primary/10 rounded-2xl overlay-slate-100/50"></video>
          </div>
          <h1 className="text-xl font-bold text-on-surface mb-4 leading-tight">
            Learn Nigerian Languages the Smart Way.
          </h1>
          <p className="text-body-md text-on-surface-variant mb-8 max-w-[320px]">
            Connect with your roots. Master Hausa, Igbo, and Yoruba through bite-sized, playful lessons.
          </p>

          <div className="w-full flex flex-col gap-2">
            <Link
              href="/login"
              className="tactile-button-primary w-full py-3 uppercase tracking-wide text-sm text-center"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="tactile-button-secondary w-full py-3 uppercase tracking-wide text-sm text-center"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mb-3 w-full">
          <h2 className="text-sm font-bold text-on-surface mb-5 text-center">I want to learn...</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'hausa', name: 'Hausa', sub: 'Kano, Sokoto & more', color: 'bg-orange-100', icon: 'location_city', iconColor: 'text-orange-600' },
              { id: 'igbo', name: 'Igbo', sub: 'Enugu, Owerri & more', color: 'bg-blue-100', icon: 'landscape', iconColor: 'text-blue-600' },
              { id: 'yoruba', name: 'Yoruba', sub: 'Lagos, Ibadan & more', color: 'bg-red-100', icon: 'temple_buddhist', iconColor: 'text-red-600' },
            ].map((lang) => (
              <Link
                key={lang.id}
                href="/login"
                className="tactile-card p-5 flex items-center gap-6 cursor-pointer hover:border-primary group"
              >
                <div className={`w-10 h-10 ${lang.color} rounded-xl flex items-center justify-center ${lang.iconColor}`}>
                  <span className="material-symbols-outlined text-[40px]">{lang.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-on-surface">{lang.name}</h3>
                  <p className="text-outline text-sm">{lang.sub}</p>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl p-4 mb-4 text-center border-1 border-outline-variant w-full">
          <span className="material-symbols-outlined text-primary text-[48px] mb-4">diversity_3</span>
          <h2 className="text-sm font-bold text-on-surface mb-2">More than just words</h2>
          <p className="text-on-surface-variant text-sm">
            Dive into the history, music, and traditions that make these languages unique.
          </p>
        </section>
      </div>
    </div>
  );
}
