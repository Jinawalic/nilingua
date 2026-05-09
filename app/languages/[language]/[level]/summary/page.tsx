/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

type LessonData = {
  id: number;
  lessonNumber: string | null;
  lessonTitle: string | null;
  entries?: { text: string; meaning: string; pronunciation?: string }[];
};

export default function LevelSummaryPage() {
  const params = useParams();
  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadLessons() {
      try {
        const response = await fetch(`/api/lessons?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`);
        if (!response.ok) {
          throw new Error('Failed to load lessons');
        }

        const lessonsData = await response.json();
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      } catch (error) {
        console.error('Unable to load level statistics:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadLessons();
  }, [language, level]);

  const xpTotal = lessons.length * 20;
  const wordsLearned = lessons.reduce((count: number, lesson) => count + (lesson.entries?.length ?? 0), 0);

  const nextLevel =
    level === 'basic' ? 'intermediate' :
      level === 'intermediate' ? 'advanced' :
        'advanced';

  const isAdvanced = level === 'advanced';

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title={`${displayLanguage} - ${displayLevel} Complete`} homeLink />

      <main className="mt-15 pb-10 px-5 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-4">
        <div className="w-full flex flex-col items-center gap-6 mt-5">
          {/* Celebration */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-xl font-bold text-on-surface">Level Complete!</h1>
            <p className="text-on-surface-variant">You've mastered {displayLevel}!</p>
          </div>

          {/* Completion card */}
          <div className="w-full rounded-xl border-1 border-primary/30 bg-primary-container/20 p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-18 h-18 rounded-full bg-primary flex items-center justify-center text-5xl">
                ⭐
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Congratulations!</h2>
              <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
                You have successfully completed all lessons in the <span className="font-bold text-primary">{displayLevel}</span> level of {displayLanguage}!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 p-4 text-center border border-orange-200">
                <p className="text-xl font-bold text-orange-600">+{xpTotal}</p>
                <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider mt-2">XP Total</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-4 text-center border border-green-200">
                <p className="text-xl font-bold text-green-600">{wordsLearned}</p>
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mt-2">Words Learned</p>
              </div>
            </div>
          </div>

          {/* Achievement message */}
          <div className="w-full rounded-xl bg-secondary-container/20 border border-secondary-container/50 p-5 text-center">
            <p className="text-sm text-on-surface-variant">
              🌟 Ready for the next challenge? Move on to <span className="font-bold text-primary">{isAdvanced ? 'mastery' : displayLevel === 'basic' ? 'Intermediate' : 'Advanced'}</span>!
            </p>
          </div>

          {/* Action buttons */}
          <div className="w-full space-y-2">
            {!isAdvanced && (
              <Link
                href={`/quiz?language=${language}&level=${level}`}
                className="w-full rounded-xl bg-primary px-4 py-4 text-center font-bold uppercase tracking-[0.24em] text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Take Quiz
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>
          <Link
            href="/home"
            className="w-full rounded-xl border-1 border-outline-variant px-4 py-4 text-center font-bold uppercase tracking-[0.24em] text-on-surface hover:bg-surface-container-low transition-all"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
