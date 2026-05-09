"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

type LessonEntryDraft = {
  text: string;
  meaning: string;
};

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

type AdminCatalogResponse = {
  languages: LanguageOption[];
  levels: LevelOption[];
};

type AdminLessonRecord = {
  dbId: number;
  id: string;
  language: string;
  level: string;
  lessonNumber: string;
  lessonTitle: string;
  word: string;
  meaning: string;
  entries: LessonEntryDraft[];
  createdAt: string;
  updatedAt: string;
};

type AdminLessonsResponse = {
  lessons: AdminLessonRecord[];
};

function fieldClassName() {
  return "w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-4 focus:ring-primary/10";
}

function sectionBadge(step: string) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-primary">
      {step}
    </span>
  );
}

function cloneEntries(entries: LessonEntryDraft[]) {
  return entries.map((entry) => ({ ...entry }));
}

function normalizeEntries(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => ({
      text: typeof entry?.text === "string" ? entry.text.trim() : "",
      meaning: typeof entry?.meaning === "string" ? entry.meaning.trim() : "",
    }))
    .filter((entry) => entry.text.length > 0 || entry.meaning.length > 0);
}

function normalizeLesson(lesson: AdminLessonRecord): AdminLessonRecord {
  return {
    ...lesson,
    id: String(lesson.dbId),
    language: lesson.language || "",
    level: lesson.level || "",
    lessonNumber: lesson.lessonNumber || "",
    lessonTitle: lesson.lessonTitle || "",
    word: lesson.word || "",
    meaning: lesson.meaning || "",
    entries: normalizeEntries(lesson.entries),
  };
}

export default function AdminLessonViewerPage() {
  const [lessons, setLessons] = useState<AdminLessonRecord[]>([]);
  const [languageOptions, setLanguageOptions] = useState<LanguageOption[]>([]);
  const [levelOptions, setLevelOptions] = useState<LevelOption[]>([]);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [draftLesson, setDraftLesson] = useState<AdminLessonRecord | null>(null);
  const [notice, setNotice] = useState("");
  const [noticeKind, setNoticeKind] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(true);

  const initialSelectionAppliedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);

      try {
        const [catalogResponse, lessonsResponse] = await Promise.all([
          fetch("/api/admin/catalog", { cache: "no-store" }),
          fetch("/api/admin/lessons", { cache: "no-store" }),
        ]);

        if (!catalogResponse.ok || !lessonsResponse.ok) {
          throw new Error("Unable to load lesson data from the database.");
        }

        const catalog = (await catalogResponse.json()) as AdminCatalogResponse;
        const lessonsData = (await lessonsResponse.json()) as AdminLessonsResponse;

        if (cancelled) {
          return;
        }

        const normalizedLessons = Array.isArray(lessonsData.lessons)
          ? lessonsData.lessons.map(normalizeLesson)
          : [];

        setLanguageOptions(Array.isArray(catalog.languages) ? catalog.languages : []);
        setLevelOptions(Array.isArray(catalog.levels) ? catalog.levels : []);
        setLessons(normalizedLessons);

        if (!initialSelectionAppliedRef.current) {
          if (normalizedLessons.length > 0) {
            const firstLesson = normalizedLessons[0];
            setLanguage(firstLesson.language);
            setLevel(firstLesson.level);
            setSelectedLessonId(firstLesson.id);
            setDraftLesson({
              ...firstLesson,
              entries: cloneEntries(firstLesson.entries),
            });
          } else if (Array.isArray(catalog.languages) && catalog.languages.length > 0) {
            setLanguage(catalog.languages[0].id);
            setLevel(Array.isArray(catalog.levels) && catalog.levels.length > 0 ? catalog.levels[0].id : "");
          }

          initialSelectionAppliedRef.current = true;
        }
      } catch {
        if (!cancelled) {
          setNoticeKind("error");
          setNotice("Unable to load languages, levels, and lessons from the database.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.id === language),
    [language, languageOptions],
  );

  const selectedLevel = useMemo(() => levelOptions.find((option) => option.id === level), [level, levelOptions]);

  const lessonsForSelection = useMemo(
    () => lessons.filter((lesson) => lesson.language === language && lesson.level === level),
    [language, level, lessons],
  );

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) || null,
    [lessons, selectedLessonId],
  );

  const canContinueToLevel = Boolean(language);
  const canContinueToLesson = Boolean(language && level);
  const hasSelection = Boolean(selectedLesson);
  const canUpdate = Boolean(draftLesson && draftLesson.lessonTitle.trim() && draftLesson.entries.length > 0);

  function clearSelection() {
    setSelectedLessonId("");
    setIsEditing(false);
    setDraftLesson(null);
    setNotice("");
  }

  function handleLanguageChange(value: string) {
    setLanguage(value);
    setLevel("");
    clearSelection();
  }

  function handleLevelChange(value: string) {
    setLevel(value);
    clearSelection();
  }

  function handleLessonChange(value: string) {
    setSelectedLessonId(value);
    setIsEditing(false);
    setNotice("");
    const lesson = lessons.find((item) => item.id === value) || null;
    setDraftLesson(lesson ? { ...lesson, entries: cloneEntries(lesson.entries) } : null);
  }

  function startEditing() {
    if (!selectedLesson) {
      return;
    }

    setDraftLesson({ ...selectedLesson, entries: cloneEntries(selectedLesson.entries) });
    setIsEditing(true);
    setNotice("");
  }

  function closePreview() {
    clearSelection();
  }

  function updateDraftLesson(partial: Partial<AdminLessonRecord>) {
    setDraftLesson((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...partial,
      };
    });
  }

  function updateDraftEntry(index: number, field: keyof LessonEntryDraft, value: string) {
    setDraftLesson((current) => {
      if (!current) {
        return current;
      }

      const nextEntries = current.entries.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      );

      return {
        ...current,
        entries: nextEntries,
      };
    });
  }

  async function handleUpdate() {
    if (!draftLesson || !selectedLesson) {
      return;
    }

    const nextEntries = draftLesson.entries
      .map((entry) => ({ text: entry.text.trim(), meaning: entry.meaning.trim() }))
      .filter((entry) => entry.text || entry.meaning);

    try {
      const response = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: draftLesson.dbId,
          language: draftLesson.language.trim(),
          level: draftLesson.level.trim(),
          lessonNumber: draftLesson.lessonNumber.trim(),
          lessonTitle: draftLesson.lessonTitle.trim(),
          entries: nextEntries,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to update lesson.");
      }

      const nextLesson = normalizeLesson(result.lesson as AdminLessonRecord);
      setLessons((currentLessons) =>
        currentLessons.map((lesson) => (lesson.dbId === nextLesson.dbId ? nextLesson : lesson)),
      );
      setSelectedLessonId(nextLesson.id);
      setLanguage(nextLesson.language);
      setLevel(nextLesson.level);
      setDraftLesson({
        ...nextLesson,
        entries: cloneEntries(nextLesson.entries),
      });
      setIsEditing(false);
      setNoticeKind("success");
      setNotice(`Lesson ${nextLesson.lessonNumber} updated successfully.`);
    } catch (error) {
      setNoticeKind("error");
      setNotice(error instanceof Error ? error.message : "Unable to update lesson.");
    }
  }

  return (
    <div className="fixed inset-0 overflow-x-hidden bg-[linear-gradient(135deg,rgba(232,237,255,0.8)_0%,rgba(248,249,255,1)_40%,rgba(241,243,249,1)_100%)]">
      <div className="flex h-full w-full min-w-0">
        <AdminSidebar />

        <main className="min-w-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#f7f8fd_0%,#eef2ff_100%)] px-6 py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-[-0.05em] text-on-surface">View lessons</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  Select a language, level, and lesson to review or update the lesson you created.
                </p>
              </div>

              <Link
                href="/admin/lessons"
                className="rounded-xl border border-outline-variant bg-white px-4 py-3 shadow-[0_10px_24px_rgba(38,65,145,0.05)]"
              >
                <p className="mt-1 text-sm font-medium text-on-surface-variant">Back to builder</p>
              </Link>
            </header>

            {notice && (
              <div
                className={
                  noticeKind === "error"
                    ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                }
              >
                {notice}
              </div>
            )}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <article className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">Lesson lookup</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Narrow the list by language, then level, then lesson.
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface px-4 py-2 text-sm font-medium text-on-surface-variant">
                    {selectedLanguage ? `${selectedLanguage.label} / ${selectedLevel?.label || "Choose level"}` : "Start here"}
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <section className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sectionBadge("1")}
                      <div>
                        <h2 className="font-semibold text-on-surface">Language</h2>
                        <p className="text-sm text-on-surface-variant">Choose the language you want to review.</p>
                      </div>
                    </div>

                    <select
                      className={fieldClassName()}
                      value={language}
                      onChange={(event) => handleLanguageChange(event.target.value)}
                      disabled={isEditing || isLoading}
                    >
                      <option value="">{isLoading ? "Loading languages..." : "Select language"}</option>
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
                        {sectionBadge("2")}
                        <div>
                          <h2 className="font-semibold text-on-surface">Level</h2>
                          <p className="text-sm text-on-surface-variant">Choose the lesson level.</p>
                        </div>
                      </div>

                      <select
                        className={fieldClassName()}
                        value={level}
                        onChange={(event) => handleLevelChange(event.target.value)}
                        disabled={isEditing || isLoading}
                      >
                        <option value="">{isLoading ? "Loading levels..." : "Select level"}</option>
                        {levelOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </section>
                  )}

                  {canContinueToLesson && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-3">
                        {sectionBadge("3")}
                        <div>
                          <h2 className="font-semibold text-on-surface">Lesson</h2>
                          <p className="text-sm text-on-surface-variant">Pick the lesson you created.</p>
                        </div>
                      </div>

                      <select
                        className={fieldClassName()}
                        value={selectedLessonId}
                        onChange={(event) => handleLessonChange(event.target.value)}
                        disabled={isEditing || isLoading}
                      >
                        <option value="">
                          {lessonsForSelection.length > 0
                            ? "Select lesson"
                            : "No lessons available for this selection"}
                        </option>
                        {lessonsForSelection.map((lesson) => (
                          <option key={lesson.id} value={lesson.id}>
                            Lesson {lesson.lessonNumber} - {lesson.lessonTitle}
                          </option>
                        ))}
                      </select>
                    </section>
                  )}

                  {hasSelection ? (
                    <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                      {isEditing
                        ? "You can now edit the lesson details below and use Update when you are done."
                        : "Lesson loaded. Use Edit to make changes or Close to pick another lesson."}
                    </section>
                  ) : (
                    <section className="rounded-xl border border-dashed border-outline-variant bg-surface/50 px-4 py-5 text-sm text-on-surface-variant">
                      Select a language, level, and lesson to display the lesson content.
                    </section>
                  )}
                </div>
              </article>
            </section>

            {selectedLesson && (
              <section className="rounded-xl border border-outline-variant bg-white p-6 shadow-[0_12px_30px_rgba(38,65,145,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-on-surface">
                      Lesson {selectedLesson.lessonNumber}
                    </p>
                    <p className="mt-1 text-sm text-on-surface-variant">{selectedLesson.lessonTitle}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={isEditing ? handleUpdate : startEditing}
                      disabled={isEditing && !canUpdate}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isEditing ? "Update" : "Edit"}
                      <span className="material-symbols-outlined text-[18px]">
                        {isEditing ? "save" : "edit"}
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
                      {sectionBadge("4")}
                      <div>
                        <h2 className="font-semibold text-on-surface">Language and level</h2>
                        <p className="text-sm text-on-surface-variant">Lesson metadata.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <select
                        className={fieldClassName()}
                        value={draftLesson?.language || ""}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftLesson({ language: event.target.value })}
                      >
                        {languageOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <select
                        className={fieldClassName()}
                        value={draftLesson?.level || ""}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftLesson({ level: event.target.value })}
                      >
                        {levelOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        className={fieldClassName()}
                        value={draftLesson?.lessonNumber || ""}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftLesson({ lessonNumber: event.target.value })}
                        placeholder="Lesson number"
                      />

                      <input
                        className={fieldClassName()}
                        value={draftLesson?.lessonTitle || ""}
                        disabled={!isEditing}
                        onChange={(event) => updateDraftLesson({ lessonTitle: event.target.value })}
                        placeholder="Lesson title"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sectionBadge("5")}
                      <div>
                        <h2 className="font-semibold text-on-surface">Entry count</h2>
                        <p className="text-sm text-on-surface-variant">Number of word and meaning pairs.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/70 bg-surface px-4 py-4">
                      <p className="text-sm font-semibold text-on-surface">
                        {draftLesson?.entries.length || 0} pair{draftLesson?.entries.length === 1 ? "" : "s"}
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        Use Edit to adjust the lesson text, then Update to save your changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {sectionBadge("6")}
                    <div>
                      <h2 className="font-semibold text-on-surface">Lesson entries</h2>
                      <p className="text-sm text-on-surface-variant">Each word or phrase with its meaning.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {(draftLesson?.entries || []).map((entry, index) => (
                      <div key={`${entry.text}-${index}`} className="rounded-xl border border-outline-variant bg-surface p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/65">
                          Pair {index + 1}
                        </p>

                        <div className="mt-4 space-y-3">
                          <input
                            className={fieldClassName()}
                            value={entry.text}
                            disabled={!isEditing}
                            onChange={(event) => updateDraftEntry(index, "text", event.target.value)}
                            placeholder="Word or phrase"
                          />

                          <textarea
                            className={`${fieldClassName()} min-h-[120px] resize-none`}
                            value={entry.meaning}
                            disabled={!isEditing}
                            onChange={(event) => updateDraftEntry(index, "meaning", event.target.value)}
                            placeholder="Meaning"
                          />
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
