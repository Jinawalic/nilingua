/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.96),_rgba(248,250,255,0.96)_40%,_rgba(226,232,240,0.95)_100%)]" />
      <div className="relative pt-24 pb-20 px-5 max-w-[480px] mx-auto overflow-x-hidden flex flex-col items-center">
        <section className="flex flex-col items-center text-center mb-12">
          <div className="relative w-full aspect-square max-w-[320px] mb-8">
            <img 
              alt="Nilingua Mascot" 
              className="w-full h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDANqlmxZEwClQDtFkbhr14BK3CjV9tJHerys5KUIu1N41jGJOWd29avQCPnmnJ90z4ZfBGDocAdNKuDDTkG17Vc659GB25CQVNn1Bm51x4qjg5Zj-WSdnPAQcq6acUkbATXMiIuEMbN7s76T-HTftilH6l8qTvwbfSPCoOPQOPy9QxcUPGK0FrauMW_JbIxXw8RFU7Czns_bQMhINNc7efpXdHSLZRyaZKSm4sR9XaT9ZBuqO4g1wHHcNRZshPQRj2YEfqIFT9q_w" 
            />
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-4 leading-tight">
            Learn Nigerian Languages the Smart Way.
          </h1>
        <p className="text-body-md text-on-surface-variant mb-8 max-w-[320px]">
          Connect with your roots. Master Hausa, Igbo, and Yoruba through bite-sized, playful lessons.
        </p>
        
        <div className="w-full flex flex-col gap-6">
          <Link 
            href="/register"
            className="tactile-button-primary w-full py-4 uppercase tracking-wide text-lg text-center"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="tactile-button-secondary w-full py-4 uppercase tracking-wide text-lg text-center"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mb-12 w-full">
        <h2 className="text-xl font-bold text-on-surface mb-6 text-center">I want to learn...</h2>
        <div className="grid grid-cols-1 gap-6">
          {[
            { id: 'hausa', name: 'Hausa', sub: 'Kano, Sokoto & more', color: 'bg-orange-100', icon: 'location_city', iconColor: 'text-orange-600' },
            { id: 'igbo', name: 'Igbo', sub: 'Enugu, Owerri & more', color: 'bg-blue-100', icon: 'landscape', iconColor: 'text-blue-600' },
            { id: 'yoruba', name: 'Yoruba', sub: 'Lagos, Ibadan & more', color: 'bg-red-100', icon: 'temple_buddhist', iconColor: 'text-red-600' },
          ].map((lang) => (
            <Link 
              key={lang.id}
              href={`/languages/${lang.id}`}
              className="tactile-card p-6 flex items-center gap-6 cursor-pointer hover:border-primary group"
            >
              <div className={`w-16 h-16 ${lang.color} rounded-lg flex items-center justify-center ${lang.iconColor}`}>
                <span className="material-symbols-outlined text-[40px]">{lang.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-on-surface">{lang.name}</h3>
                <p className="text-outline text-sm">{lang.sub}</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low rounded-2xl p-8 mb-12 text-center border-2 border-outline-variant w-full">
        <span className="material-symbols-outlined text-primary text-[48px] mb-4">diversity_3</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">More than just words</h2>
        <p className="text-on-surface-variant">
          Dive into the history, music, and traditions that make these languages unique.
        </p>
      </section>
    </div>
  </div>
  );
}
