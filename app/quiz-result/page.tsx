/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const language = searchParams.get('language') || 'igbo';
  const level = searchParams.get('level') || 'basic';
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '3');

  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const nextLevel =
    level === 'basic' ? 'intermediate' :
      level === 'intermediate' ? 'advanced' :
        'home';

  const isHomeNext = nextLevel === 'home';
  const scorePercentage = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Quiz Complete!" homeLink />

      <main className="mt-20 pb-12 px-5 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6">
        <div className="w-full flex flex-col items-center gap-6 mt-5">
          {/* Celebration */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl">🎯</div>
            <h1 className="text-3xl font-bold text-on-surface">You're mastering {displayLanguage}.</h1>
            <p className="text-on-surface-variant">Quiz completed!</p>
          </div>

          {/* Score card */}
          <div className="w-full rounded-3xl border-2 border-outline-variant bg-white p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-4xl">
                📊
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface">New Milestone!</h2>
              <p className="text-sm text-on-surface-variant mt-2">You've completed the {displayLevel} level quiz.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-blue-100 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{scorePercentage}%</p>
                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mt-2">Score</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{score}/{total}</p>
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mt-2">Correct</p>
              </div>
            </div>
          </div>

          {/* Action buttons - Stacked vertically */}
          <div className="w-full space-y-3">
            {isHomeNext ? (
              <>
                <Link
                  href="/home"
                  className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold uppercase tracking-[0.24em] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Back to Home
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href={`/languages/${language}`}
                  className="w-full rounded-xl border-2 border-outline-variant px-6 py-4 text-center font-bold uppercase tracking-[0.24em] text-on-surface hover:bg-surface-container-low transition-all"
                >
                  View Languages
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/languages/${language}/${nextLevel}`}
                  className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold uppercase tracking-[0.24em] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Next Level
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
