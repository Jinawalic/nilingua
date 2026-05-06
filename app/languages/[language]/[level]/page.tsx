/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

const levelUnits: Record<string, Array<{ id: string; title: string; subtitle: string; description: string; icon: string; status?: 'active' | 'locked' | 'completed' }>> = {
  basic: [
    { id: 'introduction', title: 'Introduction', subtitle: 'Lesson 1', description: 'Start with the core greetings and basic words.', icon: 'waving_hand', status: 'completed' },
    { id: 'basic-greetings', title: 'Basic Greetings', subtitle: 'Lesson 2', description: 'Learn how to greet people in everyday conversation.', icon: 'forum', status: 'active' },
    { id: 'family-members', title: 'Family Members', subtitle: 'Lesson 3', description: 'Name family members and practice relationships.', icon: 'group', status: 'locked' },
    { id: 'numbers-1-10', title: 'Numbers 1-10', subtitle: 'Lesson 4', description: 'Count and use numbers in basic sentences.', icon: '123', status: 'locked' },
    { id: 'common-phrases', title: 'Common Phrases', subtitle: 'Lesson 5', description: 'Speak simple but useful everyday phrases.', icon: 'chat', status: 'locked' },
  ],
  intermediate: [
    { id: 'conversation', title: 'Conversation', subtitle: 'Lesson 1', description: 'Expand your vocabulary for daily dialogue.', icon: 'record_voice_over', status: 'active' },
    { id: 'travel', title: 'Travel Essentials', subtitle: 'Lesson 2', description: 'Learn phrases for moving around town.', icon: 'travel_explore', status: 'locked' },
    { id: 'shopping', title: 'Shopping', subtitle: 'Lesson 3', description: 'Practice buying items and asking prices.', icon: 'shopping_bag', status: 'locked' },
  ],
  advanced: [
    { id: 'idioms', title: 'Idioms', subtitle: 'Lesson 1', description: 'Master expressions used by native speakers.', icon: 'auto_stories', status: 'active' },
    { id: 'culture', title: 'Culture', subtitle: 'Lesson 2', description: 'Dive into cultural context and meaning.', icon: 'theater_comedy', status: 'locked' },
  ],
};

export default function LevelUnitSelectionPage() {
  const params = useParams();
  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const lessonUnits = levelUnits[level] || levelUnits.basic;
  const shortCode = displayLanguage.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar title={`Learn ${displayLanguage}`} homeLink />

      <main className="mt-20 pb-32 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-6">
        <div className="rounded-[32px] border-2 border-dashed border-primary/40 bg-primary-container/10 p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-white text-2xl font-bold shadow-lg">
            {shortCode}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-on-surface">{displayLevel} Course</h1>
            <p className="text-sm text-on-surface-variant mt-2">Select what you want to learn under the {displayLevel} unit.</p>
          </div>
        </div>

        <div className="space-y-4">
          {lessonUnits.map((unit, index) => (
            <Link
              key={unit.id}
              href={`/languages/${language}/${level}/progress?lesson=${unit.id}`}
              className="group block rounded-3xl border-2 border-outline-variant bg-white p-5 shadow-sm transition duration-200 hover:border-primary hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low text-primary text-2xl">
                    <span className="material-symbols-outlined">{unit.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-on-surface">{unit.title}</h2>
                    <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mt-1">{unit.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span>{unit.status === 'completed' ? '✓' : unit.status === 'locked' ? '🔒' : ''}</span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-on-surface-variant">{unit.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
