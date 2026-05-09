/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TopBar, BottomBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

type LanguageItem = {
  id: string;
  label: string;
  description: string;
};

export default function LessonsPage() {
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);

  useEffect(() => {
    async function loadLanguages() {
      try {
        const response = await fetch('/api/admin/catalog');
        const result = await response.json();

        if (response.ok && Array.isArray(result.languages)) {
          setLanguages(result.languages.map((language: any) => ({
            id: language.id,
            label: language.label,
            description: language.description || '',
          })));
        }
      } catch (error) {
        console.error('Unable to load languages:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLanguages();
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
                  key={language.id}
                  href={`/languages/${language.id}`}
                  className="rounded-xl border border-outline-variant bg-white p-4 transition-shadow duration-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-semibold text-on-surface">{language.label}</h2>
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
