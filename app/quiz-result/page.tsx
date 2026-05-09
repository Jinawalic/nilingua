/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

function QuizResultContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const language = searchParams.get('language')?.toLowerCase() || 'igbo';
  const level = searchParams.get('level')?.toLowerCase() || 'basic';
  const score = parseInt(searchParams.get('score') || '0', 10);

  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const nextLevel =
    level === 'basic' ? 'intermediate' :
      level === 'intermediate' ? 'advanced' :
        'home';

  const isHomeNext = nextLevel === 'home';

  useEffect(() => {
    async function loadQuizStats() {
      try {
        const response = await fetch(`/api/quiz?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`);
        if (response.ok) {
          const quizData = await response.json();
          const quizzes = Array.isArray(quizData) ? quizData : [];
          
          let count = 0;
          quizzes.forEach((q: any) => {
            if (q.questions && Array.isArray(q.questions)) {
              count += q.questions.length;
            } else if (q.question) {
              count += 1;
            }
          });
          
          setTotalQuestions(count > 0 ? count : 3); // Fallback to 3 if no questions found
        }
      } catch (error) {
        console.error('Failed to load quiz stats:', error);
        setTotalQuestions(3);
      } finally {
        setLoading(false);
      }
    }

    loadQuizStats();
  }, [language, level]);

  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <TopBar title="Quiz Complete!" homeLink />
        <main className="mt-20 pb-12 px-5 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6">
          <div className="w-full flex flex-col items-center gap-6 mt-5">
            <div className="w-20 h-20 bg-surface-container-low rounded-full animate-pulse" />
            <div className="space-y-2 text-center">
              <div className="h-8 bg-surface-container-low rounded-lg animate-pulse w-48" />
              <div className="h-4 bg-surface-container-low rounded-lg animate-pulse w-32" />
            </div>
            <div className="w-full rounded-3xl border-2 border-outline-variant bg-white p-8 animate-pulse">
              <div className="h-6 bg-surface-container-low rounded-lg w-32 mx-auto mb-4" />
              <div className="h-4 bg-surface-container-low rounded-lg w-40 mx-auto mb-6" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-surface-container-low rounded-2xl" />
                <div className="h-16 bg-surface-container-low rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Quiz Complete!" homeLink />

      <main className="mt-13 pb-10 px-5 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6">
        <div className="w-full flex flex-col items-center gap-6 mt-5">
          {/* Celebration */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">🎯</div>
            <h1 className="text-xl font-bold text-on-surface">You're mastering {displayLanguage}.</h1>
            <p className="text-on-surface-variant">Quiz completed!</p>
          </div>

          {/* Score card */}
          <div className="w-full rounded-xl border-1 border-outline-variant bg-white p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-15 h-15 rounded-full bg-primary-container flex items-center justify-center text-3xl">
                📊
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">New Milestone!</h2>
              <p className="text-sm text-on-surface-variant mt-2">You've completed the {displayLevel} level quiz.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-100 p-4 text-center">
                <p className="text-xl font-bold text-blue-600">{scorePercentage}%</p>
                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mt-2">Score</p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-4 text-center">
                <p className="text-xl font-bold text-emerald-600">{score}/{totalQuestions}</p>
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mt-2">Correct</p>
              </div>
            </div>
          </div>

          {/* Action buttons - Stacked vertically */}
          <div className="w-full space-y-2">
            {isHomeNext ? (
              <>
                <Link
                  href="/home"
                  className="w-full rounded-xl bg-primary px-4 py-4 text-center font-bold uppercase tracking-[0.24em] text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Back to Home
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href={`/languages/${language}`}
                  className="w-full rounded-xl border-2 border-outline-variant px-4 py-4 text-center font-bold uppercase tracking-[0.24em] text-on-surface hover:bg-surface-container-low transition-all"
                >
                  View Languages
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/languages/${language}`}
                  className="w-full rounded-xl bg-primary px-4 py-4 text-center font-bold uppercase tracking-[0.24em] text-white hover:shadow-sm transition-all flex items-center justify-center gap-2"
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

export default function QuizResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-surface items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <QuizResultContent />
    </Suspense>
  );
}
