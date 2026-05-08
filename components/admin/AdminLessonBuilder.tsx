"use client";

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { createLessonId, saveStoredLesson, type LessonEntryDraft } from '@/lib/admin-lessons';

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
  { id: 'igbo', label: 'Igbo', description: 'Core greetings, vocabulary, and expressions.' },
  { id: 'yoruba', label: 'Yoruba', description: 'Practical language patterns for everyday use.' },
  { id: 'hausa', label: 'Hausa', description: 'Foundational lessons for common communication.' },
];

const levelOptions: LevelOption[] = [
  { id: 'basic', label: 'Basic', description: 'Introduction, simple words, and phrases.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Conversation, grammar, and sentence building.' },
  { id: 'advanced', label: 'Advanced', description: 'Idioms, context, and fluent usage.' },
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

export default function AdminLessonBuilder() {
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonText, setLessonText] = useState('');
  const [meaning, setMeaning] = useState('');
  const [lessonEntries, setLessonEntries] = useState<LessonEntryDraft[]>([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [isUnlockingContent, setIsUnlockingContent] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);

  const unlockTimerRef = useRef<number | null>(null);

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.id === language),
    [language],
  );

  const selectedLevel = useMemo(() => levelOptions.find((option) => option.id === level), [level]);

  const canContinueToLevel = Boolean(language);
  const canContinueToNumber = Boolean(language && level);
  const canContinueToTitle = Boolean(language && level && lessonNumber.trim());
  const canContinueToContent = Boolean(language && level && lessonNumber.trim() && lessonTitle.trim());
  const hasPendingEntry = Boolean(lessonText.trim() && meaning.trim());
  const canContinue = contentUnlocked ? hasPendingEntry : canContinueToContent;
  const canSave = Boolean((lessonEntries.length > 0 || hasPendingEntry) && canContinueToContent);
  const formattedLessonNumber = lessonNumber.trim().padStart(2, '0');

  function clearUnlockTimer() {
    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }

  function handleLanguageChange(value: string) {
    clearUnlockTimer();
    setLanguage(value);
    setLevel('');
    setLessonNumber('');
    setLessonTitle('');
    setLessonText('');
    setMeaning('');
    setLessonEntries([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingEntry(false);
  }

  function handleLevelChange(value: string) {
    clearUnlockTimer();
    setLevel(value);
    setLessonNumber('');
    setLessonTitle('');
    setLessonText('');
    setMeaning('');
    setLessonEntries([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingEntry(false);
  }

  function handleLessonNumberChange(value: string) {
    clearUnlockTimer();
    setLessonNumber(value);
    setLessonText('');
    setMeaning('');
    setLessonEntries([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingEntry(false);
  }

  function handleLessonTitleChange(value: string) {
    clearUnlockTimer();
    setLessonTitle(value);
    setLessonText('');
    setMeaning('');
    setLessonEntries([]);
    setSavedMessage('');
    setContentUnlocked(false);
    setIsUnlockingContent(false);
    setIsSavingEntry(false);
  }

  function handleContinue() {
    if (isUnlockingContent || isSavingEntry) {
      return;
    }

    if (!contentUnlocked) {
      if (!canContinueToContent) {
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

    if (!hasPendingEntry) {
      return;
    }

    setIsSavingEntry(true);
    setSavedMessage('');

    window.setTimeout(() => {
      setLessonEntries((currentEntries) => [
        ...currentEntries,
        {
          text: lessonText.trim(),
          meaning: meaning.trim(),
        },
      ]);
      setLessonText('');
      setMeaning('');
      setIsSavingEntry(false);
    }, 700);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    const finalEntries = [...lessonEntries];

    if (hasPendingEntry) {
      finalEntries.push({
        text: lessonText.trim(),
        meaning: meaning.trim(),
      });
    }

    const lessonId = createLessonId(language, level, lessonNumber);

    saveStoredLesson({
      id: lessonId,
      language,
      level,
      lessonNumber: formattedLessonNumber,
      lessonTitle: lessonTitle.trim(),
      entries: finalEntries,
      updatedAt: new Date().toISOString(),
    });

    setSavedMessage(
      `You have finished creating lesson ${formattedLessonNumber} for ${selectedLanguage?.label || 'the selected language'} (${selectedLevel?.label || 'the selected level'}). ${finalEntries.length} word pair${finalEntries.length === 1 ? '' : 's'} are ready to save to the database.`,
    );
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

        <main className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-on-surface">
                  Create a new lesson
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  Build lesson content in a clear, step-by-step flow for Nilingua admins.
                </p>
              </div>

              <Link
                href="/admin/lessons/view"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
              >
                <p className="mt-1 text-sm font-medium text-on-surface-variant">View Lessons</p>
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
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Lesson details</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Select a language, then continue through the lesson fields in order.
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
                        <p className="text-sm text-on-surface-variant">Choose the language for this lesson.</p>
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
                          <p className="text-sm text-on-surface-variant">Select the lesson difficulty level.</p>
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

                  {canContinueToNumber && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-3">
                        {sectionBadge('3')}
                        <div>
                          <h2 className="font-semibold text-on-surface">Lesson number</h2>
                          <p className="text-sm text-on-surface-variant">Enter the lesson number for this level.</p>
                        </div>
                      </div>

                      <input
                        className={fieldClassName()}
                        value={lessonNumber}
                        onChange={(event) => handleLessonNumberChange(event.target.value)}
                        placeholder="e.g. 01"
                        inputMode="numeric"
                      />
                  </section>
                )}

                  {canContinueToTitle && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-3">
                        {sectionBadge('4')}
                        <div>
                          <h2 className="font-semibold text-on-surface">Lesson title</h2>
                          <p className="text-sm text-on-surface-variant">Give the lesson a clear title.</p>
                        </div>
                      </div>

                      <input
                        className={fieldClassName()}
                        value={lessonTitle}
                        onChange={(event) => handleLessonTitleChange(event.target.value)}
                        placeholder="e.g. Greetings and Introductions"
                      />
                    </section>
                  )}

                  {canContinueToContent && (
                    <>
                      {contentUnlocked ? (
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {sectionBadge('5')}
                              <div>
                                <h2 className="font-semibold text-on-surface">Lesson text</h2>
                                <p className="text-sm text-on-surface-variant">Enter the lesson content here.</p>
                              </div>
                            </div>

                            <textarea
                              className={`${fieldClassName()} min-h-[200px] resize-none`}
                              value={lessonText}
                              onChange={(event) => {
                                setLessonText(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Write the lesson content for students..."
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {sectionBadge('6')}
                              <div>
                                <h2 className="font-semibold text-on-surface">Meaning</h2>
                                <p className="text-sm text-on-surface-variant">Add the meaning or translation.</p>
                              </div>
                            </div>

                            <textarea
                              className={`${fieldClassName()} min-h-[200px] resize-none`}
                              value={meaning}
                              onChange={(event) => {
                                setMeaning(event.target.value);
                                setSavedMessage('');
                              }}
                              placeholder="Enter the meaning or explanation..."
                            />
                          </div>

                        </section>
                      ) : (
                        <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                          Click <span className="font-semibold text-on-surface">Continue</span> to unlock the lesson text
                          and meaning fields.
                        </section>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant/70 pt-5">
                  <p className="text-sm text-on-surface-variant">
                    {canSave
                      ? 'All fields are ready. Save this lesson and move to the next one.'
                      : 'Complete the fields in order, then Continue will unlock the lesson text and meaning fields.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue || isUnlockingContent || isSavingEntry}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUnlockingContent || isSavingEntry ? 'Continuing...' : 'Continue'}
                    {isUnlockingContent || isSavingEntry ? (
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
                    disabled={!canSave}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(38,65,145,0.18)] transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Finish lesson
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </form>

              <aside className="flex flex-col gap-5">
                <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Lesson flow</p>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">1. Language</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Choose the language first.</p>
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">2. Level</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Appears after the language selection.</p>
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3">
                      <p className="text-sm font-semibold text-on-surface">3. Content</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Lesson number, title, text, and meaning.</p>
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
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">Lesson</p>
                      <p className="mt-1 font-medium text-on-surface">{lessonNumber || 'No lesson number yet'}</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-outline-variant bg-white p-5 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Draft entries</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {lessonEntries.length > 0
                      ? `${lessonEntries.length} word pair${lessonEntries.length === 1 ? '' : 's'} captured so far.`
                      : 'No saved word pairs yet.'}
                  </p>

                  <div className="mt-4 space-y-3">
                    {lessonEntries.length > 0 ? (
                      lessonEntries.slice(-3).map((entry, index) => {
                        const entryNumber = lessonEntries.length - Math.min(lessonEntries.length, 3) + index + 1;

                        return (
                          <div key={`${entry.text}-${entry.meaning}-${index}`} className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">
                              Entry {entryNumber}
                            </p>
                            <p className="mt-1 font-medium text-on-surface">{entry.text}</p>
                            <p className="mt-1 text-sm text-on-surface-variant">{entry.meaning}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-outline-variant/70 bg-surface px-4 py-3 text-sm text-on-surface-variant">
                        Use Continue to keep adding word pairs here.
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
