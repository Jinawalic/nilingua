/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';

export const dynamic = 'force-dynamic';

const quizQuestions = [
  {
    question: 'Translate the phrase: "How are you?"',
    options: [
      { id: 0, text: 'Bawo ni', label: 'A' },
      { id: 1, text: 'E kaaro', label: 'B' },
      { id: 2, text: 'Odaabo', label: 'C' },
      { id: 3, text: 'E ku ise', label: 'D' },
    ],
    answerId: 0,
  },
  {
    question: 'Translate the phrase: "Good morning"',
    options: [
      { id: 0, text: 'Bawo ni', label: 'A' },
      { id: 1, text: 'E kaaro', label: 'B' },
      { id: 2, text: 'Odaabo', label: 'C' },
      { id: 3, text: 'Mo wa daadaa', label: 'D' },
    ],
    answerId: 1,
  },
  {
    question: 'Translate the phrase: "Thank you"',
    options: [
      { id: 0, text: 'Jowo', label: 'A' },
      { id: 1, text: 'E ṣeun', label: 'B' },
      { id: 2, text: 'O dara', label: 'C' },
      { id: 3, text: 'Ẹ kaaro', label: 'D' },
    ],
    answerId: 1,
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = searchParams.get('language') || 'igbo';
  const level = searchParams.get('level') || 'basic';

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  const handleOptionClick = (optionId: number) => {
    setSelected(optionId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (optionId === currentQuestion.answerId) {
      setScore((prev) => prev + 1);
      setToast({ type: 'success', message: 'Correct! Great job.' });
      setToastVisible(true);
      timeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    } else {
      const correctLabel = currentQuestion.options.find((item) => item.id === currentQuestion.answerId)?.label ?? 'A';
      setToast({ type: 'error', message: `Wrong! the correct option is ${correctLabel}.` });
      setToastVisible(true);
      timeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  const handleFooterClick = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setToastVisible(false);
      setToast(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const totalQuestions = quizQuestions.length;
    const finalScore = (selected === currentQuestion.answerId) ? score + 1 : score;
    router.push(`/quiz-result?language=${language}&level=${level}&score=${finalScore}&total=${totalQuestions}`);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title="Quiz: Greetings" />

      <main className="flex-1 pt-24 pb-32 px-5 max-w-[480px] mx-auto w-full relative">
        {toastVisible && toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full lg:max-w-[440px] rounded-xl border-1 px-5 py-4 flex items-start justify-between gap-4 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-red-400 border-red-700 text-white'}`}>
            <div className="space-y-1">
              <p className="font-bold text-sm uppercase tracking-[0.16em]">
                {toast.type === 'success' ? 'Correct!' : 'Wrong!'}
              </p>
              <p className="text-sm leading-6">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              aria-label="Dismiss toast"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}></div>
          </div>
          <p className="text-xs font-bold text-outline mt-2 uppercase tracking-widest text-right">Question {currentIndex + 1} of {quizQuestions.length}</p>
        </div>

        <h2 className="text-2xl font-bold text-on-surface mb-8">{currentQuestion.question}</h2>

        <div className="grid grid-cols-1 gap-2">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className={`w-full text-left px-6 py-4 rounded-xl border-1 transition-all duration-200 ${selected === opt.id
                ? 'border-primary bg-primary text-white '
                : 'bg-white text-slate-900 border-outline-variant hover:bg-slate-50'
                }`}
            >
              <span className="font-bold text-lg">{opt.label}. </span>
              <span className="text-lg font-semibold">{opt.text}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-white border-t-2 border-outline-variant z-50">
        <div className="max-w-[480px] mx-auto">
          <button
            disabled={selected === null}
            onClick={handleFooterClick}
            className={`tactile-button-primary w-full h-14 flex items-center justify-center gap-2 ${selected === null ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          >
            {isLastQuestion ? (
              <>
                Check score
                <span className="material-symbols-outlined">done_all</span>
              </>
            ) : (
              <>
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
