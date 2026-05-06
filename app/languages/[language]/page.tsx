/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function LevelSelectionPage() {
  const params = useParams();
  const language = params.language as string;

  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);

  const levels = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Start your journey with fundamental words and phrases',
      icon: '🌱',
      color: 'bg-green-100',
      borderColor: 'border-green-300',
      lessons: '5 lessons',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Build on your foundation with more complex vocabulary',
      icon: '📚',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300',
      lessons: '8 lessons',
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Master the language with advanced expressions and context',
      icon: '🚀',
      color: 'bg-purple-100',
      borderColor: 'border-purple-300',
      lessons: '10 lessons',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title={`Learn ${displayLanguage}`} homeLink />

      <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-3">
        <div className="space-y-2 mt-2">
          <div className="rounded-xl border border-primary/20 bg-primary-container/10 p-4">
            <h1 className="text-xl font-bold text-on-surface">Choose Your Level</h1>
            <p className="text-sm text-on-surface-variant mt-2">Select a level to start learning {displayLanguage}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/languages/${language}/${level.id}`}
              className={`${level.color} ${level.borderColor} border-2 rounded-xl p-4 transition-shadow duration-200 hover:shadow-xl`}
            >
              <div className="flex items-center gap-4">
                <div className="min-w-[52px] min-h-[52px] rounded-2xl bg-white/90 flex items-center justify-center text-3xl shadow-sm">
                  {level.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-on-surface">{level.name}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">{level.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                <span>{level.lessons}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center">
          <p className="text-sm text-on-surface-variant">
            💡 Start with Basic for the fastest progress, then move to Intermediate or Advanced when you are ready.
          </p>
        </div>
      </main>
    </div>
  );
}
