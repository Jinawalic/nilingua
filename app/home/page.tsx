/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { TopBar, BottomBar } from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar streak={5} />

      <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto space-y-8 w-full">
        <section className="space-y-1">
          <h2 className="text-3xl font-bold text-on-surface">Good Morning, John</h2>
          <p className="text-on-surface-variant font-medium">Ready for your daily Nigerian language fix?</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 tactile-card flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-on-surface">5</span>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mt-1">Day Streak</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 tactile-card space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-primary">bolt</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Level 4</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold text-on-surface">1,240</span>
                <span className="text-[10px] font-bold text-on-surface-variant">/ 1,500 XP</span>
              </div>
              <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden relative">
                <div className="h-full bg-primary-container w-[82%] relative">
                  {/* Progress shine effect can be added to globals.css if needed */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">Current Course</h3>
          <div className="relative overflow-hidden bg-primary-container/10 border-2 border-primary rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  🇳🇬
                </div>
                <div>
                  <h4 className="text-xl font-bold text-on-surface">Yoruba</h4>
                  <p className="text-on-primary-container font-medium">Intermediate Level</p>
                </div>
              </div>
              <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                45%
              </div>
            </div>
            <Link
              href="/lessons"
              className="tactile-button-primary w-full py-4 flex items-center justify-center gap-2 text-center"
            >
              Continue Learning
              <span className="material-symbols-outlined">play_circle</span>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">Other Languages</h3>
            <button className="text-primary text-[10px] font-bold tracking-widest uppercase">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Igbo', id: 'igbo', sub: 'Language of the Igbo people', icon: 'language', color: 'text-secondary' },
              { name: 'Hausa', id: 'hausa', sub: 'Language of the Hausa people', icon: 'language', color: 'text-tertiary' },
            ].map((topic, i) => (
              <Link
                key={i}
                href={`/languages/${topic.id}`}
                className="bg-white border-2 border-outline-variant rounded-xl p-4 flex items-center justify-between tactile-card hover:shadow-lg hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center">
                    <span className={`material-symbols-outlined ${topic.color}`}>{topic.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">{topic.name}</h5>
                    <p className="text-xs text-on-surface-variant">{topic.sub}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-secondary/5 rounded-2xl p-6 border-2 border-dashed border-secondary/30 relative overflow-hidden">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary text-3xl">lightbulb</span>
            <div className="space-y-2">
              <h6 className="text-sm font-bold text-secondary uppercase tracking-widest">Proverb of the Day</h6>
              <p className="text-on-surface italic font-medium leading-relaxed">
                "Ọmọ tí a kò kọ́, ni yóò gbé ilé tí a kọ́ tà."
              </p>
              <p className="text-xs text-outline leading-tight">
                The child we do not teach will sell the house we build.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BottomBar />
    </div>
  );
}
