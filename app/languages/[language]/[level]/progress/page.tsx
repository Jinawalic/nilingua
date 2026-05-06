/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

const levelUnits: Record<string, Array<{ id: string; title: string; description: string }>> = {
  basic: [
    { id: 'introduction', title: 'Introduction', description: 'Start with the core greetings and basic words.' },
    { id: 'basic-greetings', title: 'Basic Greetings', description: 'Learn how to greet people in everyday conversation.' },
    { id: 'family-members', title: 'Family Members', description: 'Name family members and practice relationships.' },
    { id: 'numbers-1-10', title: 'Numbers 1-10', description: 'Count and use numbers in basic sentences.' },
    { id: 'common-phrases', title: 'Common Phrases', description: 'Speak simple but useful everyday phrases.' },
  ],
  intermediate: [
    { id: 'conversation', title: 'Conversation', description: 'Expand your vocabulary for daily dialogue.' },
    { id: 'travel', title: 'Travel Essentials', description: 'Learn phrases for moving around town.' },
    { id: 'shopping', title: 'Shopping', description: 'Practice buying items and asking prices.' },
  ],
  advanced: [
    { id: 'idioms', title: 'Idioms', description: 'Master expressions used by native speakers.' },
    { id: 'culture', title: 'Culture', description: 'Dive into cultural context and meaning.' },
  ],
};

const lessonContent: Record<string, Record<string, Array<{ word: string; meaning: string; pronunciation: string }>>> = {
  igbo: {
    basic: [
      { word: 'Kedu', meaning: 'Hello/How are you?', pronunciation: 'KAY-doo' },
      { word: 'Daalụ', meaning: 'Thank you', pronunciation: 'DAH-loo' },
      { word: 'Ọma', meaning: 'Good/Well', pronunciation: 'OH-mah' },
      { word: 'Ego', meaning: 'Money', pronunciation: 'EH-go' },
      { word: 'Akwụ', meaning: 'Hand', pronunciation: 'AH-kwoo' },
    ],
    intermediate: [
      { word: 'Ihe mma', meaning: 'Something good', pronunciation: 'EE-hay MAH' },
      { word: 'Ọ daalụ', meaning: 'It is good', pronunciation: 'OH DAH-loo' },
      { word: 'Ụta', meaning: 'Song', pronunciation: 'OO-tah' },
      { word: 'Ezigbo ụbọchị', meaning: 'Good day', pronunciation: 'eh-ZEE-gbo OO-bo-chee' },
      { word: 'Amụ', meaning: 'Learn', pronunciation: 'AH-moo' },
    ],
    advanced: [
      { word: 'Nchọ ozizi', meaning: 'Spiritual guidance', pronunciation: 'n-CHO oh-ZEE-zee' },
      { word: 'Ụlọ nri', meaning: 'Restaurant/dining house', pronunciation: 'OO-lo n-REE' },
      { word: 'Echiche', meaning: 'Thought/reflection', pronunciation: 'eh-CHEE-chay' },
      { word: 'Ịgbanwụ', meaning: 'To change/transform', pronunciation: 'ee-gban-WOO' },
      { word: 'Ohere', meaning: 'Opportunity', pronunciation: 'oh-HEH-ray' },
    ],
  },
  hausa: {
    basic: [
      { word: 'Sannu', meaning: 'Hello', pronunciation: 'SAHN-noo' },
      { word: 'Na gida', meaning: 'I am fine', pronunciation: 'nah GEE-dah' },
      { word: 'Godiya', meaning: 'Thank you', pronunciation: 'go-DEE-yah' },
      { word: 'Kyau', meaning: 'Good/OK', pronunciation: 'KYY-ow' },
      { word: 'Gida', meaning: 'Home', pronunciation: 'GEE-dah' },
    ],
    intermediate: [
      { word: 'Ina kwana', meaning: 'Where are you going?', pronunciation: 'ee-nah KWH-nah' },
      { word: 'Aiki', meaning: 'Work/Job', pronunciation: 'AH-ee-kee' },
      { word: 'Yara', meaning: 'Child', pronunciation: 'YAH-rah' },
      { word: 'Waje', meaning: 'Outside', pronunciation: 'WAH-jay' },
      { word: 'Dare', meaning: 'Night', pronunciation: 'DAH-ray' },
    ],
    advanced: [
      { word: 'Tunani', meaning: 'To think/consider', pronunciation: 'too-NAH-nee' },
      { word: 'Tattalin', meaning: 'Business/commerce', pronunciation: 'tah-TAH-lin' },
      { word: 'Jizyar', meaning: 'Responsibility', pronunciation: 'jee-ZYAR' },
      { word: 'Zaman', meaning: 'Time/era', pronunciation: 'ZAH-man' },
      { word: 'Hankali', meaning: 'Wisdom/understanding', pronunciation: 'hahn-KAH-lee' },
    ],
  },
  yoruba: {
    basic: [
      { word: 'Bawo', meaning: 'Hello', pronunciation: 'BAH-wo' },
      { word: 'Pẹlẹ o', meaning: 'Take it easy', pronunciation: 'PEH-leh oh' },
      { word: 'E ṣeun', meaning: 'Thank you', pronunciation: 'eh SHEH-oon' },
      { word: 'Ẹ kaabo', meaning: 'Welcome', pronunciation: 'eh KAH-bo' },
      { word: 'Ile', meaning: 'Home', pronunciation: 'EE-leh' },
    ],
    intermediate: [
      { word: 'Ire', meaning: 'Good/blessing', pronunciation: 'EE-reh' },
      { word: 'Iṣẹ', meaning: 'Work', pronunciation: 'ee-SHEH' },
      { word: 'Omo', meaning: 'Child', pronunciation: 'OH-mo' },
      { word: 'Ojo', meaning: 'Day', pronunciation: 'OH-jo' },
      { word: 'Ẹkọ', meaning: 'Learning/education', pronunciation: 'EH-ko' },
    ],
    advanced: [
      { word: 'Awọn irunmọlẹ', meaning: 'Spiritual beings', pronunciation: 'ah-WON ee-roon-MOH-leh' },
      { word: 'Igbagbo', meaning: 'Belief/faith', pronunciation: 'ee-GBAH-gbo' },
      { word: 'Oruko', meaning: 'Name/identity', pronunciation: 'oh-ROO-ko' },
      { word: 'Ìran', meaning: 'Generation/lineage', pronunciation: 'ee-RAHN' },
      { word: 'Ìwọ', meaning: 'Respect/honor', pronunciation: 'ee-WOH' },
    ],
  },
};

export default function LearningProgressPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = params.language as string;
  const level = params.level as string;
  const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const displayLevel = level.charAt(0).toUpperCase() + level.slice(1);

  const lessonId = searchParams.get('lesson') || levelUnits[level]?.[0]?.id || 'introduction';
  const lessonsInLevel = levelUnits[level] || levelUnits.basic;
  const lessonIndex = lessonsInLevel.findIndex((lesson) => lesson.id === lessonId) + 1;
  const selectedLesson = lessonsInLevel.find((lesson) => lesson.id === lessonId) || lessonsInLevel[0];
  const currentLanguageLessons = lessonContent[language.toLowerCase()] || lessonContent.igbo;
  const currentLevelContent = currentLanguageLessons[level.toLowerCase()] || currentLanguageLessons.basic;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const totalCards = currentLevelContent.length;
  const progress = ((currentCardIndex + 1) / totalCards) * 100;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const isLastCard = currentCardIndex === totalCards - 1;
  const currentCard = currentLevelContent[currentCardIndex];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title={`${displayLanguage} - ${displayLevel}`} homeLink />

      <main className="mt-20 pb-2 px-5 max-w-[480px] mx-auto w-full flex flex-col gap-6">
        <div className="rounded-xl border border-dashed border-primary/30 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-on-surface-variant uppercase tracking-[0.26em]">Lesson {lessonIndex}</p>
              <h1 className="text-2xl font-bold text-on-surface mt-2">{selectedLesson.title}</h1>
              <p className="text-sm text-on-surface-variant mt-2">{selectedLesson.description}</p>
            </div>
            <div className="rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold">{displayLevel}</div>
          </div>
        </div>

        <div className="space-y-3">
          {/* <div className="rounded-[32px] border border-primary/20 bg-primary-container/20 p-6 text-center">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Progress</p>
            <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm font-bold text-primary mt-3">{currentCardIndex + 1} / {totalCards}</p>
          </div> */}

          <div className="rounded-xl border border-outline-variant bg-white p-8 text-center">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Word</p>
            <p className="text-4xl font-bold text-on-surface">{currentCard.word}</p>
            <p className="text-sm text-on-surface-variant italic mt-4">{currentCard.pronunciation}</p>
          </div>

          <div className="rounded-xl border border-secondary/20 bg-secondary-container/20 p-6 text-center">
            <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-3">Meaning</p>
            <p className="text-2xl font-bold text-on-surface">{currentCard.meaning}</p>
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
            className="flex-1 rounded-xl border-2 border-outline-variant bg-white px-5 py-4 text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-container-low transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <span className="material-symbols-outlined align-middle">arrow_forward</span>
          </button>
        </div>

        {isLastCard && (
          <Link
            href={`/languages/${language}/${level}/complete?lesson=${lessonId}`}
            className="w-full rounded-3xl bg-primary px-6 py-4 text-center font-bold uppercase tracking-[0.24em] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Finish Learning
            <span className="material-symbols-outlined">check_circle</span>
          </Link>
        )}
      </main>
    </div>
  );
}
