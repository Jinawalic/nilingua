/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';
import { saveCurrentCourse } from '@/lib/current-course';

export const dynamic = 'force-dynamic';

type LessonData = {
  id: number;
  lessonNumber: string | null;
  lessonTitle: string | null;
  entries?: { text: string; meaning: string; pronunciation?: string }[];
};

export default function CompletionPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadLessons() {
      try {
        const response = await fetch(`/api/lessons?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`);
        if (!response.ok) {
          throw new Error('Failed to load lessons');
        }

        const lessonsData = await response.json();
        const lessonList: LessonData[] = Array.isArray(lessonsData) ? lessonsData : [];
        setLessons(lessonList);

        const lessonParam = searchParams.get('lesson');
        const selectedLessonId = lessonParam || (lessonList[0]?.id ? String(lessonList[0].id) : '');
        setCurrentLessonId(selectedLessonId);
        const currentIndex = lessonList.findIndex((lesson) => String(lesson.id) === selectedLessonId);
        setLessonIndex(currentIndex >= 0 ? currentIndex : 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadLessons();
  }, [language, level, searchParams]);

  const selectedLesson = lessons.find((lesson) => String(lesson.id) === currentLessonId) ?? lessons[lessonIndex] ?? null;
  const nextLessonId = lessons[lessonIndex + 1]?.id;
  const isLastLesson = lessonIndex >= lessons.length - 1;

  const entryCount = selectedLesson?.entries?.length ?? 3;
  const xpEarned = 10 + entryCount * 8 + lessonIndex * 2;
  const timeSpentSeconds = 120 + entryCount * 25;
  const timeSpent = `${Math.floor(timeSpentSeconds / 60)}:${String(timeSpentSeconds % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveCurrentCourse({
      language,
      level,
      lessonId: currentLessonId,
      lessonTitle: `Lesson ${lessonIndex + 1} complete`,
      displayLanguage,
      displayLevel,
      resumeUrl: `${window.location.pathname}${window.location.search}`,
      progressPercent: 100,
      updatedAt: Date.now(),
    });
  }, [currentLessonId, displayLanguage, displayLevel, isLoaded, language, level, lessonIndex]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <TopBar title="Lesson Complete!" homeLink />
        <main className="mt-20 pb-12 px-5 max-w-[480px] mx-auto w-full flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="h-24 w-full rounded-xl bg-surface-container-low animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title="Lesson Complete!" homeLink />

      <main className="mt-20 pb-12 px-5 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6">
        <div className="w-full flex flex-col items-center gap-6 mt-5">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">👍</div>
            <h1 className="text-xl font-bold text-on-surface">Lesson Complete!</h1>
            <p className="text-on-surface-variant">You're mastering {displayLanguage}.</p>
          </div>

          <div className="w-full rounded-xl border-1 border-outline-variant bg-white p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-xl">
                🏆
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">New Milestone!</h2>
              <p className="text-sm text-on-surface-variant mt-2">You've completed {lessonIndex + 1} {displayLevel} lesson{lessonIndex + 1 !== 1 ? 's' : ''} this week.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-orange-100 p-4 text-center">
                <p className="text-xl font-bold text-orange-600">+{xpEarned}</p>
                <p className="text-xs text-orange-700 font-semibold uppercase tracking-wider mt-2">XP Earned</p>
              </div>
              <div className="rounded-xl bg-blue-100 p-4 text-center">
                <p className="text-xl font-bold text-blue-600">{timeSpent}</p>
                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mt-2">Time Spent</p>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3">
            {!isLastLesson && nextLessonId ? (
              <Link
                href={`/languages/${language}/${level}/progress?lesson=${nextLessonId}`}
                className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold uppercase text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Finish & Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            ) : (
              <Link
                href={`/languages/${language}/${level}/summary`}
                className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold uppercase text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Finish & Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
