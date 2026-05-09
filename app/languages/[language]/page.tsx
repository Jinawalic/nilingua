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

type LevelItem = {
  id: string;
  label: string;
  description: string;
};

const levelMeta: Record<string, { icon: string; color: string; borderColor: string; lessons: string }> = {
  basic: { icon: '🌱', color: 'bg-green-100', borderColor: 'border-green-300', lessons: '5 lessons' },
  intermediate: { icon: '📚', color: 'bg-blue-100', borderColor: 'border-blue-300', lessons: '8 lessons' },
  advanced: { icon: '🚀', color: 'bg-purple-100', borderColor: 'border-purple-300', lessons: '10 lessons' },
};

export default function LevelSelectionPage() {
  const params = useParams();
  const language = params.language as string;

  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load catalog levels
        const catalogResponse = await fetch('/api/admin/catalog');
        const catalogData = await catalogResponse.json();

        if (catalogResponse.ok && Array.isArray(catalogData.levels)) {
          setLevels(catalogData.levels.map((level: any) => ({
            id: level.id,
            label: level.label,
            description: level.description || '',
          })));
        }

        // Fetch lesson counts for this language
        const lessonsResponse = await fetch(`/api/lessons?language=${encodeURIComponent(language)}`);
        if (lessonsResponse.ok) {
          const lessonsData = await lessonsResponse.json();
          const lessons = Array.isArray(lessonsData) ? lessonsData : [];
          
          const counts: Record<string, number> = {};
          lessons.forEach((lesson: any) => {
            const lvl = (lesson.level || '').toLowerCase();
            if (lvl) {
              counts[lvl] = (counts[lvl] || 0) + 1;
            }
          });
          setLevelCounts(counts);
        }
      } catch (error) {
        console.error('Unable to load level data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language]);

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
          {levels.map((level) => {
            const meta = levelMeta[level.id] ?? levelMeta.basic;

            return (
              <Link
                key={level.id}
                href={`/languages/${language}/${level.id}`}
                className={`${meta.color} ${meta.borderColor} border-2 rounded-xl p-4 transition-shadow duration-200 hover:shadow-xl`}
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-[52px] min-h-[52px] rounded-2xl bg-white/90 flex items-center justify-center text-3xl shadow-sm">
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-on-surface">{level.label}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{level.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  <span>
                    {levelCounts[level.id.toLowerCase()] || 0} {' '}
                    {levelCounts[level.id.toLowerCase()] === 1 ? 'Lesson' : 'Lessons'}
                  </span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </Link>
            );
          })}
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
