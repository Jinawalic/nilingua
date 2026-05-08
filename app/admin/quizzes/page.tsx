"use client";

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createQuizId, getStoredQuizzes, saveStoredQuiz, type QuizQuestionDraft } from '@/lib/admin-quizzes';

type LanguageOption = {
  id: string;
  label: string;
  description: string;
};

type LevelOption = {
  id: string;
  label: string;
  description: string;
};

const languageOptions: LanguageOption[] = [
  { id: 'igbo', label: 'Igbo', description: 'Practical quiz questions for everyday language use.' },
  { id: 'yoruba', label: 'Yoruba', description: 'Assessment prompts for core vocabulary and phrases.' },
  { id: 'hausa', label: 'Hausa', description: 'Simple checks for foundational comprehension.' },
];

const levelOptions: LevelOption[] = [
  { id: 'basic', label: 'Basic', description: 'Short, direct quiz questions for beginners.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Mixed recall and comprehension questions.' },
  { id: 'advanced', label: 'Advanced', description: 'Deeper context and translation-based questions.' },
];

function fieldClassName() {
  return 'w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-4 focus:ring-primary/10';
}

function sectionBadge(step: string) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
      {step}
    </span>
  );
}

export default function AdminQuizzesPage() {
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D' | ''>('');
  const [quizDrafts, setQuizDrafts] = useState<QuizQuestionDraft[]>([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [isUnlockingContent, setIsUnlockingContent] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const unlockTimerRef = useRef<number | null>(null);
  const mainScrollRef = useRef<HTMLElement | null>(null);

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.id === language),
    [language],
  );

  const selectedLevel = useMemo(() => levelOptions.find((option) => option.id === level), [level]);

  const canContinueToLevel = Boolean(language);
  const canContinueToQuestions = Boolean(language && level);
  const hasPendingQuestion = Boolean(question.trim() && optionA.trim() && optionB.trim() && optionC.trim() && optionD.trim() && correctOption);
  const canContinue = quizFinished ? false : contentUnlocked ? hasPendingQuestion : canContinueToQuestions;
  const canFinish = Boolean(canContinueToQuestions && (quizDrafts.length > 0 || hasPendingQuestion) && !quizFinished);

  function clearUnlockTimer() {
    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }

  function resetQuestionFields() {
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOption('');
  }

  function resetWorkspace() {
    clearUnlockTimer();
    setLanguage('');
    setLevel('');
    resetQuestionFields();
    setQuizDrafts([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingQuestion(false);
    setQuizFinished(false);
  }

  function handleLanguageChange(value: string) {
    resetWorkspace();
    setLanguage(value);
  }

  function handleLevelChange(value: string) {
    clearUnlockTimer();
    setLevel(value);
    resetQuestionFields();
    setQuizDrafts([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingQuestion(false);
    setQuizFinished(false);
  }

  function handleContinue() {
    if (quizFinished || isUnlockingContent || isSavingQuestion) {
      return;
    }

    if (!contentUnlocked) {
      if (!canContinueToQuestions) {
        return;
      }

      setSavedMessage('');
      setIsUnlockingContent(true);
      clearUnlockTimer();

      unlockTimerRef.current = window.setTimeout(() => {
        setContentUnlocked(true);
        setIsUnlockingContent(false);
        unlockTimerRef.current = null;
      }, 1800);

      return;
    }

    if (!hasPendingQuestion) {
      return;
    }

    setIsSavingQuestion(true);
    setSavedMessage('');

    window.setTimeout(() => {
      setQuizDrafts((currentDrafts) => [
        ...currentDrafts,
        {
          question: question.trim(),
          options: {
            a: optionA.trim(),
            b: optionB.trim(),
            c: optionC.trim(),
            d: optionD.trim(),
          },
          correctOption: correctOption as 'A' | 'B' | 'C' | 'D',
        },
      ]);
      resetQuestionFields();
      setIsSavingQuestion(false);
    }, 700);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canFinish) {
      return;
    }

    const finalDrafts = [...quizDrafts];

    if (hasPendingQuestion) {
      finalDrafts.push({
        question: question.trim(),
        options: {
          a: optionA.trim(),
          b: optionB.trim(),
          c: optionC.trim(),
          d: optionD.trim(),
        },
        correctOption: correctOption as 'A' | 'B' | 'C' | 'D',
      });
    }

    const existingQuizzes = getStoredQuizzes();
    const nextQuizNumber = String(
      existingQuizzes.filter((quiz) => quiz.language === language && quiz.level === level).length + 1,
    ).padStart(2, '0');
    const quizId = createQuizId(language, level, nextQuizNumber);

    saveStoredQuiz({
      id: quizId,
      language,
      level,
      quizNumber: nextQuizNumber,
      questions: finalDrafts,
      updatedAt: new Date().toISOString(),
    });

    setSavedMessage(
      `You have finished creating quiz ${nextQuizNumber} for ${selectedLanguage?.label || 'the selected language'} (${selectedLevel?.label || 'the selected level'}). ${finalDrafts.length} question${finalDrafts.length === 1 ? '' : 's'} are ready to save to the database.`,
    );
    setQuizFinished(true);
    setContentUnlocked(false);
    setIsSavingQuestion(false);
    setIsUnlockingContent(false);
    resetQuestionFields();
    clearUnlockTimer();
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    return () => {
      clearUnlockTimer();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-x-hidden bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_40%,rgba(241,243,249,1)_100%)]">
      <div className="flex h-full w-full min-w-0">
        <AdminSidebar />

        <main ref={mainScrollRef} className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div><h1 className="text-xl font-semibold tracking-[-0.05em] text-on-surface">
                  Create a new quiz
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  Build quiz content in a clear, step-by-step flow for Nilingua admins.
                </p>
              </div>

              <Link
                href="/admin/quizzes/view"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
              >
                <p className="mt-1 text-sm font-medium text-on-surface-variant">View Quizzes</p>
              </Link>
            </header>

            {savedMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {savedMessage}
              </div>
            )}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <form onSubmit={handleSubmit} className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Quiz details</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Select a language, then continue through the quiz fields in order.
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface px-4 py-2 text-sm font-medium text-on-surface-variant">
                    {selectedLanguage ? `${selectedLanguage.label} / ${selectedLevel?.label || 'Choose level'}` : 'Start here'}
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <section className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sectionBadge('1')}
                      <div>
                        <h2 className="font-semibold text-on-surface">Language</h2>
                        <p className="text-sm text-on-surface-variant">Choose the language for this quiz.</p>
                      </div>
                    </div>

                    <select
                      className={fieldClassName()}
                      value={language}
                      onChange={(event) => handleLanguageChange(event.target.value)}
                    >
                      <option value="">Select language</option>
                      {languageOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </section>

                  {canContinueToLevel && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-3">
                        {sectionBadge('2')}
                        <div>
                          <h2 className="font-semibold text-on-surface">Level</h2>
                          <p className="text-sm text-on-surface-variant">Select the quiz difficulty level.</p>
                        </div>
                      </div>

                      <select
                        className={fieldClassName()}
                        value={level}
                        onChange={(event) => handleLevelChange(event.target.value)}
                      >
                        <option value="">Select level</option>
                        {levelOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </section>
                  )}

                  {canContinueToQuestions && (
                    <>
                      {contentUnlocked ? (
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                          <div className="space-y-3 xl:col-span-2">
                            <div className="flex items-center gap-3">
                              {sectionBadge('3')}
                              <div>
                                <h2 className="font-semibold text-on-surface">Question prompt</h2>
                                <p className="text-sm text-on-surface-variant">Write the quiz question here.</p>
                              </div>
                            </div>

                            <textarea
                              className={`${fieldClassName()} min-h-[150px] resize-none`}
                              value={question}
                              onChange={(event) => {
                                setQuestion(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Write the question prompt for students..."
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
                                A
                              </span>
                              <div>
                                <h2 className="font-semibold text-on-surface">Option A</h2>
                                <p className="text-sm text-on-surface-variant">First answer choice.</p>
                              </div>
                            </div>

                            <input
                              className={fieldClassName()}
                              value={optionA}
                              onChange={(event) => {
                                setOptionA(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Enter option A"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
                                B
                              </span>
                              <div>
                                <h2 className="font-semibold text-on-surface">Option B</h2>
                                <p className="text-sm text-on-surface-variant">Second answer choice.</p>
                              </div>
                            </div>

                            <input
                              className={fieldClassName()}
                              value={optionB}
                              onChange={(event) => {
                                setOptionB(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Enter option B"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
                                C
                              </span>
                              <div>
                                <h2 className="font-semibold text-on-surface">Option C</h2>
                                <p className="text-sm text-on-surface-variant">Third answer choice.</p>
                              </div>
                            </div>

                            <input
                              className={fieldClassName()}
                              value={optionC}
                              onChange={(event) => {
                                setOptionC(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Enter option C"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
                                D
                              </span>
                              <div>
                                <h2 className="font-semibold text-on-surface">Option D</h2>
                                <p className="text-sm text-on-surface-variant">Fourth answer choice.</p>
                              </div>
                            </div>

                            <input
                              className={fieldClassName()}
                              value={optionD}
                              onChange={(event) => {
                                setOptionD(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Enter option D"
                            />
                          </div>

                          <div className="space-y-3 xl:col-span-2">
                            <div className="flex items-center gap-3">
                              {sectionBadge('4')}
                              <div>
                                <h2 className="font-semibold text-on-surface">Correct answer</h2>
                                <p className="text-sm text-on-surface-variant">Mark the correct option for this question.</p>
                              </div>
                            </div>

                            <select
                              className={fieldClassName()}
                              value={correctOption}
                              onChange={(event) => {
                                setCorrectOption(event.target.value as 'A' | 'B' | 'C' | 'D');
                                setSavedMessage('');
                              }}
                            >
                              <option value="">Select correct option</option>
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                        </section>
                      ) : (
                        <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                          Click <span className="font-semibold text-on-surface">Continue</span> to unlock the quiz question fields.
                        </section>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant/70 pt-5">
                  <p className="text-sm text-on-surface-variant">
                    {quizFinished
                      ? 'Quiz creation is complete. The success message is ready at the top of the page.'
                      : contentUnlocked
                        ? 'Fill each question, use Continue to save drafts, then finish the quiz when you are done.'
                        : 'Complete the quiz details in order, then Continue will unlock the question builder.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUnlockingContent || isSavingQuestion ? 'Continuing...' : 'Continue'}
                    {isUnlockingContent || isSavingQuestion ? (
                      <span
                        aria-hidden="true"
                        className="inline-flex h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={!canFinish}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Finish quiz
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                  </button>
                </div>
              </form>

              <aside className="flex flex-col gap-5">
                <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Quiz flow</p>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">1. Language</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Choose the language for the quiz.</p>
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">2. Level</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Select the quiz difficulty level.</p>
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">3. Questions</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Add questions, options, and the correct answer.</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Current selection</p>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Language</p>
                      <p className="mt-1 font-medium text-on-surface">{selectedLanguage?.label || 'Not selected'}</p>
                    </div>
                    <div className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Level</p>
                      <p className="mt-1 font-medium text-on-surface">{selectedLevel?.label || 'Not selected'}</p>
                    </div>
                    <div className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Drafts</p>
                      <p className="mt-1 font-medium text-on-surface">{quizDrafts.length} saved question{quizDrafts.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Draft questions</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {quizDrafts.length > 0
                      ? `${quizDrafts.length} question${quizDrafts.length === 1 ? '' : 's'} captured so far.`
                      : 'No saved questions yet.'}
                  </p>

                  <div className="mt-4 space-y-3">
                    {quizDrafts.length > 0 ? (
                      quizDrafts.slice(-3).map((draft, index) => {
                        const draftNumber = quizDrafts.length - Math.min(quizDrafts.length, 3) + index + 1;

                        return (
                          <div
                            key={`${draft.question}-${draft.correctOption}-${index}`}
                            className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-3"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">
                              Question {draftNumber}
                            </p>
                            <p className="mt-1 font-medium text-on-surface">{draft.question}</p>
                            <p className="mt-1 text-sm text-on-surface-variant">
                              Correct answer: {draft.correctOption}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-outline-variant/70 bg-surface px-4 py-3 text-sm text-on-surface-variant">
                        Use Continue to keep adding questions here.
                      </div>
                    )}
                  </div>
                </article>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
