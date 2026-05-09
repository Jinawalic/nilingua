/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';
import { saveCurrentCourse } from '@/lib/current-course';

export const dynamic = 'force-dynamic';

type LessonEntry = {
  text: string;
  meaning: string;
  pronunciation?: string;
};

type LessonData = {
  id: number;
  lessonNumber: string | null;
  lessonTitle: string | null;
  entries?: LessonEntry[];
  word?: string | null;
  meaning?: string | null;
};

export default function LearningProgressPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLessons() {
      setLoading(true);
      try {
        const response = await fetch(`/api/lessons?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`);
        if (!response.ok) {
          throw new Error('Failed to load lessons');
        }

        const lessonsData = await response.json();
        const lessonList: LessonData[] = Array.isArray(lessonsData) ? lessonsData : [];

        setLessons(lessonList);

        const lessonParam = searchParams.get('lesson');
        const foundLesson = lessonParam ? lessonList.find((lesson) => String(lesson.id) === lessonParam) : null;
        setSelectedLesson(foundLesson ?? lessonList[0] ?? null);
        setCurrentCardIndex(0);
      } catch (error) {
        console.error(error);
        setLessons([]);
        setSelectedLesson(null);
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [language, level, searchParams]);

  const lessonId = searchParams.get('lesson') || String(selectedLesson?.id ?? '');
  const lessonIndex = selectedLesson ? lessons.findIndex((lesson) => lesson.id === selectedLesson.id) + 1 : 0;
  const lessonTitle = selectedLesson?.lessonTitle ?? (selectedLesson?.lessonNumber ?? `Lesson ${lessonIndex}`);
  const lessonDescription = selectedLesson?.meaning ? `Learn the word ${selectedLesson.meaning}` : 'Continue learning in this lesson.';

  const cards = selectedLesson?.entries && Array.isArray(selectedLesson.entries) && selectedLesson.entries.length > 0
    ? selectedLesson.entries
    : selectedLesson
      ? [{ text: selectedLesson.word || lessonTitle, meaning: selectedLesson.meaning || 'Continue learning', pronunciation: '' }]
      : [];

  const totalCards = cards.length;
  const progress = totalCards > 0 ? ((currentCardIndex + 1) / totalCards) * 100 : 0;
  const currentCard = cards[currentCardIndex] ?? { text: '', meaning: '', pronunciation: '' };
  const isLastCard = currentCardIndex === totalCards - 1;

  useEffect(() => {
    if (!selectedLesson) {
      return;
    }

    saveCurrentCourse({
      language,
      level,
      lessonId,
      lessonTitle,
      displayLanguage,
      displayLevel,
      resumeUrl: `${window.location.pathname}${window.location.search}`,
      progressPercent: Math.min(100, Math.max(0, Math.round(progress))),
      updatedAt: Date.now(),
    });
  }, [displayLanguage, displayLevel, language, level, lessonId, lessonTitle, progress, selectedLesson]);

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((current) => current + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((current) => current - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <TopBar showBack onBack={() => router.back()} title={`${displayLanguage} - ${displayLevel}`} homeLink />
        <main className="mt-20 pb-2 px-5 max-w-[480px] mx-auto w-full">
          <div className="space-y-4">
            <div className="h-28 rounded-xl bg-surface-container-low animate-pulse" />
            <div className="h-48 rounded-xl bg-surface-container-low animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title={`${displayLanguage} - ${displayLevel}`} homeLink />

      <main className="mt-20 pb-2 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-6">
        <div className="rounded-xl border border-dashed border-primary/30 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-on-surface-variant uppercase tracking-[0.26em]">Lesson {lessonIndex}</p>
              <h1 className="text-[15px] font-bold text-on-surface">{lessonTitle}</h1>
            </div>
            <div className="rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold">{displayLevel}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-outline-variant bg-white p-4 text-center">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Word</p>
            <p className="text-[15px] font-semibold text-on-surface">{currentCard.text}</p>
            <p className="text-sm text-on-surface-variant italic mt-4">{currentCard.pronunciation}</p>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-secondary-container/20 p-4 text-center">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Meaning</p>
            <p className="text-[15px] font-semibold text-on-surface">{currentCard.meaning}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="flex-1 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-5 py-4 text-sm font-semibold text-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined align-middle">arrow_back</span>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isLastCard}
            className="flex-1 rounded-xl border-2 border-outline-variant bg-white px-5 py-4 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <span className="material-symbols-outlined align-middle">arrow_forward</span>
          </button>
        </div>

        {isLastCard && selectedLesson && (
          <Link
            href={`/languages/${language}/${level}/complete?lesson=${selectedLesson.id}`}
            className="w-full rounded-xl bg-primary px-6 py-4 text-center font-bold uppercase tracking-[0.24em] text-white hover:shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Finish Learning
            <span className="material-symbols-outlined">check_circle</span>
          </Link>
        )}
      </main>
    </div>
  );
}
