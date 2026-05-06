/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TopBar, BottomBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function LessonsPage() {
  const [loading, setLoading] = useState(true);

  const languages = [
    {
      slug: 'igbo',
      name: 'Igbo',
      description: 'Learn greetings, basics, and everyday expressions.',
      flag: '🇳🇬',
    },
    {
      slug: 'yoruba',
      name: 'Yoruba',
      description: 'Start with core vocabulary and useful phrases.',
      flag: '🇳🇬',
    },
    {
      slug: 'hausa',
      name: 'Hausa',
      description: 'Explore the fundamentals of one of Nigeria’s major languages.',
      flag: '🇳🇬',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Choose a Language" />

      <main className="mt-20 pb-32 px-6 max-w-[480px] mx-auto w-full flex flex-col gap-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-20 rounded-[32px] bg-surface-container-low animate-pulse" />
            <div className="h-20 rounded-[32px] bg-surface-container-low animate-pulse" />
            <div className="h-20 rounded-[32px] bg-surface-container-low animate-pulse" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-xl border border-primary/20 bg-primary-container/10 p-4">
              <h1 className="text-xl font-bold text-on-surface">Which language do you want to learn?</h1>
              <p className="text-sm text-on-surface-variant mt-2">Select a language to continue into lessons and quizzes.</p>
            </div>

            <div className="flex flex-col gap-3">
              {languages.map((language) => (
                <Link
                  key={language.slug}
                  href={`/languages/${language.slug}`}
                  className="rounded-xl border border-outline-variant bg-white p-4 transition-shadow duration-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-semibold text-on-surface">{language.name}</h2>
                      <p className="text-sm text-on-surface-variant mt-1">{language.description}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary">arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomBar />
    </div>
  );
}
