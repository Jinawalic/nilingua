"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  createQuizId,
  getStoredQuizzes,
  type QuizQuestionDraft,
  type StoredQuiz,
  upsertStoredQuiz,
} from '@/lib/admin-quizzes';

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

function cloneQuestions(questions: QuizQuestionDraft[]) {
  return questions.map((question) => ({
    ...question,
    options: { ...question.options },
  }));
}

export default function AdminQuizViewerPage() {
  const [quizzes, setQuizzes] = useState<StoredQuiz[]>([]);
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuiz, setDraftQuiz] = useState<StoredQuiz | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const refreshQuizzes = () => {
      setQuizzes(getStoredQuizzes());
    };

    refreshQuizzes();

    window.addEventListener('storage', refreshQuizzes);
    return () => window.removeEventListener('storage', refreshQuizzes);
  }, []);

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.id === language),
    [language],
  );

  const selectedLevel = useMemo(
    () => levelOptions.find((option) => option.id === level),
    [level],
  );

  const quizzesForSelection = useMemo(
    () => quizzes.filter((quiz) => quiz.language === language && quiz.level === level),
    [language, level, quizzes],
  );

  const selectedQuiz = useMemo(
    () => quizzes.find((quiz) => quiz.id === selectedQuizId) || null,
    [quizzes, selectedQuizId],
  );

  const canContinueToLevel = Boolean(language);
  const canContinueToQuiz = Boolean(language && level);
  const hasSelection = Boolean(selectedQuiz);
  const canUpdate = Boolean(draftQuiz && draftQuiz.questions.length > 0);

  function clearSelection() {
    setSelectedQuizId('');
    setIsEditing(false);
    setDraftQuiz(null);
    setNotice('');
  }

  function handleLanguageChange(value: string) {
    setLanguage(value);
    setLevel('');
    clearSelection();
  }

  function handleLevelChange(value: string) {
    setLevel(value);
    clearSelection();
  }

  function handleQuizChange(value: string) {
    setSelectedQuizId(value);
    setIsEditing(false);
    setNotice('');
    const quiz = quizzes.find((item) => item.id === value) || null;
    setDraftQuiz(quiz ? { ...quiz, questions: cloneQuestions(quiz.questions) } : null);
  }

  function startEditing() {
    if (!selectedQuiz) {
      return;
    }

    setDraftQuiz({ ...selectedQuiz, questions: cloneQuestions(selectedQuiz.questions) });
    setIsEditing(true);
    setNotice('');
  }

  function closePreview() {
    clearSelection();
  }

  function updateDraftQuiz(partial: Partial<StoredQuiz>) {
    setDraftQuiz((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...partial,
      };
    });
  }

  function updateDraftQuestion(index: number, field: 'question' | 'correctOption', value: string) {
    setDraftQuiz((current) => {
      if (!current) {
        return current;
      }

      const nextQuestions = current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question,
      );

      return {
        ...current,
        questions: nextQuestions,
      };
    });
  }

  function updateDraftOption(index: number, optionKey: 'a' | 'b' | 'c' | 'd', value: string) {
    setDraftQuiz((current) => {
      if (!current) {
        return current;
      }

      const nextQuestions = current.questions.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              options: {
                ...question.options,
                [optionKey]: value,
              },
            }
          : question,
      );

      return {
        ...current,
        questions: nextQuestions,
      };
    });
  }

  function handleUpdate() {
    if (!draftQuiz || !selectedQuiz) {
      return;
    }

    const nextQuiz: StoredQuiz = {
      ...draftQuiz,
      id: createQuizId(draftQuiz.language, draftQuiz.level, draftQuiz.quizNumber),
      language: draftQuiz.language,
      level: draftQuiz.level,
      quizNumber: draftQuiz.quizNumber.trim().padStart(2, '0'),
      questions: draftQuiz.questions
        .map((question) => ({
          question: question.question.trim(),
          options: {
            a: question.options.a.trim(),
            b: question.options.b.trim(),
            c: question.options.c.trim(),
            d: question.options.d.trim(),
          },
          correctOption: question.correctOption,
        }))
        .filter((question) =>
          Boolean(question.question || question.options.a || question.options.b || question.options.c || question.options.d),
        ),
      updatedAt: new Date().toISOString(),
    };

    const nextQuizzes = upsertStoredQuiz(selectedQuiz.id, nextQuiz);
    setQuizzes(nextQuizzes);
    setSelectedQuizId(nextQuiz.id);
    setLanguage(nextQuiz.language);
    setLevel(nextQuiz.level);
    setDraftQuiz(nextQuiz);
    setIsEditing(false);
    setNotice(`Quiz ${nextQuiz.quizNumber} updated successfully.`);
  }

  return (
    <div className="fixed inset-0 overflow-x-hidden bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_40%,rgba(241,243,249,1)_100%)]">
      <div className="flex h-full w-full min-w-0">
        <AdminSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-[-0.05em] text-on-surface">View quizzes</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  Select a language, level, and quiz to review or update the quiz you created.
                </p>
              </div>

              <Link
                href="/admin/quizzes"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
              >
                <p className="mt-1 text-sm font-medium text-on-surface-variant">Back to builder</p>
              </Link>
            </header>

            {notice && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {notice}
              </div>
            )}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <article className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Quiz lookup</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Narrow the list by language, then level, then quiz.
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
                        <p className="text-sm text-on-surface-variant">Choose the language you want to review.</p>
                      </div>
                    </div>

                    <select
                      className={fieldClassName()}
                      value={language}
                      onChange={(event) => handleLanguageChange(event.target.value)}
                      disabled={isEditing}
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
                          <p className="text-sm text-on-surface-variant">Choose the quiz level.</p>
                        </div>
                      </div>

                      <select
                        className={fieldClassName()}
                        value={level}
                        onChange={(event) => handleLevelChange(event.target.value)}
                        disabled={isEditing}
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

                  {canContinueToQuiz && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-3">
                        {sectionBadge('3')}
                        <div>
                          <h2 className="font-semibold text-on-surface">Quiz</h2>
                          <p className="text-sm text-on-surface-variant">Pick the quiz you created.</p>
                        </div>
                      </div>

                      <select
                        className={fieldClassName()}
                        value={selectedQuizId}
                        onChange={(event) => handleQuizChange(event.target.value)}
                        disabled={isEditing}
                      >
                        <option value="">
                          {quizzesForSelection.length > 0 ? 'Select quiz' : 'No quizzes available for this selection'}
                        </option>
                        {quizzesForSelection.map((quiz) => (
                          <option key={quiz.id} value={quiz.id}>
                            Quiz {quiz.quizNumber} - {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                          </option>
                        ))}
                      </select>
                    </section>
                  )}

                  {hasSelection ? (
                    <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                      {isEditing
                        ? 'You can now edit the quiz details below and use Update when you are done.'
                        : 'Quiz loaded. Use Edit to make changes or Close to pick another quiz.'}
                    </section>
                  ) : (
                    <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                      Select a language, level, and quiz to display the quiz content.
                    </section>
                  )}
                </div>
              </article>
            </section>

            {selectedQuiz && (
              <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">
                      Quiz {selectedQuiz.quizNumber}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {selectedQuiz.questions.length} question{selectedQuiz.questions.length === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={isEditing ? handleUpdate : startEditing}
                      disabled={isEditing && !canUpdate}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isEditing ? 'Update' : 'Edit'}
                      <span className="material-symbols-outlined text-[18px]">
                        {isEditing ? 'save' : 'edit'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={closePreview}
                      className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold text-on-surface-variant shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
                    >
                      Close
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sectionBadge('4')}
                      <div>
                        <h2 className="font-semibold text-on-surface">Language and level</h2>
                        <p className="text-sm text-on-surface-variant">Quiz metadata.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <select
                        className={fieldClassName()}
                        value={draftQuiz?.language || ''}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftQuiz({ language: event.target.value })}
                      >
                        {languageOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <select
                        className={fieldClassName()}
                        value={draftQuiz?.level || ''}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftQuiz({ level: event.target.value })}
                      >
                        {levelOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      className={fieldClassName()}
                      value={draftQuiz?.quizNumber || ''}
                      disabled={!isEditing}
                      onChange={(event) => updateDraftQuiz({ quizNumber: event.target.value })}
                      placeholder="Quiz number"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sectionBadge('5')}
                      <div>
                        <h2 className="font-semibold text-on-surface">Question count</h2>
                        <p className="text-sm text-on-surface-variant">Total questions in this quiz.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-4">
                      <p className="text-sm font-semibold text-on-surface">
                        {draftQuiz?.questions.length || 0} question{draftQuiz?.questions.length === 1 ? '' : 's'}
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        Use Edit to adjust the quiz question set, then Update to save your changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {sectionBadge('6')}
                    <div>
                      <h2 className="font-semibold text-on-surface">Questions</h2>
                      <p className="text-sm text-on-surface-variant">Each question with options and correct answer.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {(draftQuiz?.questions || []).map((question, index) => (
                      <div key={`${question.question}-${index}`} className="rounded-xl border border-outline-variant bg-surface p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">
                          Question {index + 1}
                        </p>

                        <div className="mt-4 space-y-4">
                          <textarea
                            className={`${fieldClassName()} min-h-[120px] resize-none`}
                            value={question.question}
                            disabled={!isEditing}
                            onChange={(event) => updateDraftQuestion(index, 'question', event.target.value)}
                            placeholder="Question prompt"
                          />

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                              className={fieldClassName()}
                              value={question.options.a}
                              disabled={!isEditing}
                              onChange={(event) => updateDraftOption(index, 'a', event.target.value)}
                              placeholder="Option A"
                            />
                            <input
                              className={fieldClassName()}
                              value={question.options.b}
                              disabled={!isEditing}
                              onChange={(event) => updateDraftOption(index, 'b', event.target.value)}
                              placeholder="Option B"
                            />
                            <input
                              className={fieldClassName()}
                              value={question.options.c}
                              disabled={!isEditing}
                              onChange={(event) => updateDraftOption(index, 'c', event.target.value)}
                              placeholder="Option C"
                            />
                            <input
                              className={fieldClassName()}
                              value={question.options.d}
                              disabled={!isEditing}
                              onChange={(event) => updateDraftOption(index, 'd', event.target.value)}
                              placeholder="Option D"
                            />
                          </div>

                          <select
                            className={fieldClassName()}
                            value={question.correctOption}
                            disabled={!isEditing}
                            onChange={(event) => updateDraftQuestion(index, 'correctOption', event.target.value)}
                          >
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
