/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/Navigation';
import { clearCurrentCourse } from '@/lib/current-course';

export const dynamic = 'force-dynamic';

type QuizOption = {
  id: number;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
};

type QuizQuestion = {
  question: string;
  options: QuizOption[];
  answerLabel: 'A' | 'B' | 'C' | 'D';
};

const defaultQuizQuestions: QuizQuestion[] = [
  {
    question: 'Translate the phrase: "How are you?"',
    options: [
      { id: 0, text: 'Bawo ni', label: 'A' },
      { id: 1, text: 'E kaaro', label: 'B' },
      { id: 2, text: 'Odaabo', label: 'C' },
      { id: 3, text: 'E ku ise', label: 'D' },
    ],
    answerLabel: 'A',
  },
  {
    question: 'Translate the phrase: "Good morning"',
    options: [
      { id: 0, text: 'Bawo ni', label: 'A' },
      { id: 1, text: 'E kaaro', label: 'B' },
      { id: 2, text: 'Odaabo', label: 'C' },
      { id: 3, text: 'Mo wa daadaa', label: 'D' },
    ],
    answerLabel: 'B',
  },
  {
    question: 'Translate the phrase: "Thank you"',
    options: [
      { id: 0, text: 'Jowo', label: 'A' },
      { id: 1, text: 'E ṣeun', label: 'B' },
      { id: 2, text: 'O dara', label: 'C' },
      { id: 3, text: 'Ẹ kaaro', label: 'D' },
    ],
    answerLabel: 'B',
  },
];

function normalizeQuizRow(row: any): QuizQuestion[] {
  const rawQuestions = Array.isArray(row?.questions) ? row.questions : [];

  const formattedFromJson = rawQuestions
    .map((item: any) => {
      const question = String(item?.question || '').trim();
      const options = item?.options || {};
      const a = String(options?.a || '').trim();
      const b = String(options?.b || '').trim();
      const c = String(options?.c || '').trim();
      const d = String(options?.d || '').trim();
      const correctOption = String(item?.correctOption || '').trim().toUpperCase();

      if (!question || !a || !b || !c || !d || !['A', 'B', 'C', 'D'].includes(correctOption)) {
        return null;
      }

      return {
        question,
        options: [
          { id: 0, text: a, label: 'A' as const },
          { id: 1, text: b, label: 'B' as const },
          { id: 2, text: c, label: 'C' as const },
          { id: 3, text: d, label: 'D' as const },
        ],
        answerLabel: correctOption as 'A' | 'B' | 'C' | 'D',
      };
    })
    .filter(Boolean) as QuizQuestion[];

  if (formattedFromJson.length > 0) {
    return formattedFromJson;
  }

  const question = String(row?.question || '').trim();
  const optionA = String(row?.optionA || '').trim();
  const optionB = String(row?.optionB || '').trim();
  const optionC = String(row?.optionC || '').trim();
  const optionD = String(row?.optionD || '').trim();
  const answer = String(row?.answer || '').trim();

  if (!question || !optionA || !optionB || !optionC || !optionD) {
    return [];
  }

  let correctOption = answer.toUpperCase();
  if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
    if (answer === optionA) correctOption = 'A';
    else if (answer === optionB) correctOption = 'B';
    else if (answer === optionC) correctOption = 'C';
    else if (answer === optionD) correctOption = 'D';
    else correctOption = 'A';
  }

  return [
    {
      question,
      options: [
        { id: 0, text: optionA, label: 'A' },
        { id: 1, text: optionB, label: 'B' },
        { id: 2, text: optionC, label: 'C' },
        { id: 3, text: optionD, label: 'D' },
      ],
      answerLabel: correctOption as 'A' | 'B' | 'C' | 'D',
    },
  ];
}

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(defaultQuizQuestions);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const language = searchParams.get('language') ?? 'igbo';
  const level = searchParams.get('level') ?? 'basic';

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const response = await fetch(`/api/quiz?language=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`);
        if (!response.ok) {
          throw new Error('Unable to load quiz questions');
        }

        const quizData = await response.json();
        const quizzes = Array.isArray(quizData) ? quizData : [];
        const firstQuiz = quizzes[0] ?? null;

        if (firstQuiz) {
          const parsedQuestions = normalizeQuizRow(firstQuiz);
          if (parsedQuestions.length > 0) {
            setQuizQuestions(parsedQuestions);
          } else {
            setQuizQuestions(defaultQuizQuestions);
          }
        } else {
          setQuizQuestions(defaultQuizQuestions);
        }
      } catch (error) {
        console.error('Quiz load failed:', error);
        setQuizQuestions(defaultQuizQuestions);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [language, level]);

  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  const handleOptionClick = (optionId: number) => {
    setSelected(optionId);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const selectedLabel = quizQuestions[currentIndex]?.options?.find((item) => item.id === optionId)?.label;
    const correctLabel = currentQuestion.answerLabel;

    if (selectedLabel === correctLabel) {
      setScore((prev) => prev + 1);
      setToast({ type: 'success', message: 'Correct! Great job.' });
      setToastVisible(true);
      timeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    } else {
      setToast({ type: 'error', message: `Wrong! the correct option is ${correctLabel}.` });
      setToastVisible(true);
      timeoutRef.current = setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  const handleFooterClick = async () => {
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
    const selectedLabel = selected !== null ? currentQuestion.options[selected]?.label : null;
    const finalScore = selectedLabel === currentQuestion.answerLabel ? score + 1 : score;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/quiz-result?language=${language}&level=${level}&score=${finalScore}&total=${totalQuestions}`);
  };

  useEffect(() => {
    clearCurrentCourse();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopBar showBack onBack={() => router.back()} title={`Quiz: ${language.charAt(0).toUpperCase() + language.slice(1)} ${level.charAt(0).toUpperCase() + level.slice(1)}`} />

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

        <h2 className="text-[15px] font-bold text-on-surface mb-8">{currentQuestion.question}</h2>

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
              <span className="font-bold text-[15px]">{opt.label}. </span>
              <span className="text-[15px] font-semibold">{opt.text}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 bg-white border-t-2 border-outline-variant z-50">
        <div className="max-w-[480px] mx-auto">
          <button
            disabled={selected === null || submitting}
            onClick={handleFooterClick}
            aria-busy={submitting}
            className={`tactile-button-primary w-full h-14 flex items-center justify-center gap-2 ${(selected === null || submitting) ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          >
            {submitting ? (
              <>
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Submitting...
              </>
            ) : isLastQuestion ? (
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
