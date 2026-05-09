/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

type CatalogLevel = {
  id: string;
  label: string;
  description: string;
};

type LessonItem = {
  id: number;
  lessonNumber: string | null;
  lessonTitle: string | null;
  word: string | null;
  meaning: string | null;
};

const levelMeta: Record<string, { icon: string; color: string; borderColor: string }> = {
  basic: { icon: '🌱', color: 'bg-green-100', borderColor: 'border-green-300' },
  intermediate: { icon: '📚', color: 'bg-blue-100', borderColor: 'border-blue-300' },
  advanced: { icon: '🚀', color: 'bg-purple-100', borderColor: 'border-purple-300' },
};

const defaultDescription = 'Select what you want to learn under this unit.';

export default function LevelUnitSelectionPage() {
  const params = useParams();
  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const shortCode = displayLanguage.slice(0, 2).toUpperCase();

  const [levelInfo, setLevelInfo] = useState<CatalogLevel | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const catalogPromise = fetch('/api/admin/catalog').then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load level catalog');
        }
        return response.json();
      });

      const lessonsPromise = fetch(`/api/lessons?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`).then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load lessons');
        }
        return response.json();
      });

      try {
        const [catalogData, lessonsData] = await Promise.all([catalogPromise, lessonsPromise]);

        const currentLevel = Array.isArray(catalogData.levels)
          ? catalogData.levels.find((item: any) => item.id === level)
          : null;

        if (currentLevel) {
          setLevelInfo({
            id: currentLevel.id,
            label: currentLevel.label,
            description: currentLevel.description || defaultDescription,
          });
        } else {
          setLevelInfo({
            id: level,
            label: level.charAt(0).toUpperCase() + level.slice(1),
            description: defaultDescription,
          });
        }

        if (Array.isArray(lessonsData)) {
          setLessons(lessonsData.map((lesson: any) => ({
            id: lesson.id,
            lessonNumber: lesson.lessonNumber || null,
            lessonTitle: lesson.lessonTitle || null,
            word: lesson.word || null,
            meaning: lesson.meaning || null,
          })));
        } else {
          setLessons([]);
        }
      } catch (error) {
        console.error(error);
        setLevelInfo({
          id: level,
          label: level.charAt(0).toUpperCase() + level.slice(1),
          description: defaultDescription,
        });
        setLessons([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language, level]);

  const levelLabel = levelInfo?.label ?? displayLanguage;
  const levelDescription = levelInfo?.description ?? defaultDescription;
  const meta = levelMeta[level] ?? levelMeta.basic;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title={`Learn ${displayLanguage}`} homeLink />

      <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-4">
        <div className={`rounded-xl border-2 border-dashed border-primary/40 ${meta.color} p-4`}>
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white text-xl font-bold">
            {shortCode}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-on-surface">{levelLabel} Course</h1>
            <p className="text-sm text-on-surface-variant mt-2">{levelDescription}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-24 rounded-xl bg-surface-container-low animate-pulse" />
            <div className="h-24 rounded-xl bg-surface-container-low animate-pulse" />
            <div className="h-24 rounded-xl bg-surface-container-low animate-pulse" />
          </div>
        ) : lessons.length > 0 ? (
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const title = lesson.lessonTitle || lesson.lessonNumber || `Lesson ${index + 1}`;
              const subtitle = lesson.lessonNumber || `Lesson ${index + 1}`;
              const description = lesson.meaning || lesson.word || 'Continue with the next lesson in this course.';

              return (
                <Link
                  key={lesson.id}
                  href={`/languages/${language}/${level}/progress?lesson=${lesson.id}`}
                  className="group block rounded-xl border-2 border-outline-variant bg-white p-4 transition duration-200 hover:border-primary hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary text-xl">
                        <span className="material-symbols-outlined">auto_stories</span>
                      </div>
                      <div>
                        <h2 className="text-[15px] font-semibold text-on-surface">{title}</h2>
                        <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mt-1">{subtitle}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                  </div>
                  {/* <p className="mt-4 text-sm text-on-surface-variant">{description}</p> */}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-outline-variant bg-white p-6 text-center">
            <p className="text-sm text-on-surface-variant">No lessons were found for this language and level yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
