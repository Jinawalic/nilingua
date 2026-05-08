export type LessonEntryDraft = {
  text: string;
  meaning: string;
};

export type StoredLesson = {
  id: string;
  language: string;
  level: string;
  lessonNumber: string;
  lessonTitle: string;
  entries: LessonEntryDraft[];
  updatedAt: string;
};

const STORAGE_KEY = 'nilingua-admin-lessons';

export function createLessonId(language: string, level: string, lessonNumber: string) {
  return `${language}-${level}-${lessonNumber.trim().padStart(2, '0')}`.toLowerCase();
}

export function getStoredLessons(): StoredLesson[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredLesson(lesson: StoredLesson) {
  if (typeof window === 'undefined') {
    return [];
  }

  const lessons = getStoredLessons();
  const nextLessons = [
    ...lessons.filter((item) => item.id !== lesson.id),
    lesson,
  ].sort((a, b) => a.language.localeCompare(b.language) || a.level.localeCompare(b.level) || a.lessonNumber.localeCompare(b.lessonNumber));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLessons));
  return nextLessons;
}

export function updateStoredLesson(lessonId: string, lesson: StoredLesson) {
  if (typeof window === 'undefined') {
    return [];
  }

  const lessons = getStoredLessons();
  const nextLessons = lessons.map((item) => (item.id === lessonId ? lesson : item));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLessons));
  return nextLessons;
}

export function upsertStoredLesson(previousId: string, lesson: StoredLesson) {
  if (typeof window === 'undefined') {
    return [];
  }

  const lessons = getStoredLessons();
  const nextLessons = [
    ...lessons.filter((item) => item.id !== previousId && item.id !== lesson.id),
    lesson,
  ].sort((a, b) => a.language.localeCompare(b.language) || a.level.localeCompare(b.level) || a.lessonNumber.localeCompare(b.lessonNumber));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLessons));
  return nextLessons;
}
