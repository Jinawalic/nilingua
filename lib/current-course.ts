export type CurrentCourseState = {
  language: string;
  level: string;
  lessonId: string;
  lessonTitle: string;
  displayLanguage: string;
  displayLevel: string;
  resumeUrl: string;
  progressPercent: number;
  updatedAt: number;
};

const STORAGE_KEY = "nilingua_current_course";

function isClient() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadCurrentCourse(): CurrentCourseState | null {
  if (!isClient()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const stored = JSON.parse(raw) as CurrentCourseState;
    if (
      typeof stored.language !== "string" ||
      typeof stored.level !== "string" ||
      typeof stored.lessonId !== "string" ||
      typeof stored.lessonTitle !== "string" ||
      typeof stored.displayLanguage !== "string" ||
      typeof stored.displayLevel !== "string" ||
      typeof stored.resumeUrl !== "string" ||
      typeof stored.progressPercent !== "number" ||
      typeof stored.updatedAt !== "number"
    ) {
      return null;
    }

    return stored;
  } catch {
    return null;
  }
}

export function saveCurrentCourse(course: CurrentCourseState) {
  if (!isClient()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(course));
  } catch {
    // ignore write errors in restricted environments
  }
}

export function clearCurrentCourse() {
  if (!isClient()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore removal errors in restricted environments
  }
}
