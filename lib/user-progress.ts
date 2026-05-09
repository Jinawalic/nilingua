export type UserProgressState = {
  streak: number;
  xp: number;
  xpGoal: number;
  level: number;
  lastCompletedLessonKey?: string;
  updatedAt: number;
};

const STORAGE_KEY = "nilingua_user_progress";

function isClient() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

const DEFAULT_PROGRESS: UserProgressState = {
  streak: 5,
  xp: 1240,
  xpGoal: 1500,
  level: 4,
  updatedAt: Date.now(),
};

export function loadUserProgress(): UserProgressState {
  if (!isClient()) {
    return DEFAULT_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PROGRESS;
    }

    const stored = JSON.parse(raw) as Partial<UserProgressState>;
    return {
      ...DEFAULT_PROGRESS,
      ...stored,
      updatedAt: typeof stored.updatedAt === "number" ? stored.updatedAt : Date.now(),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(update: Partial<UserProgressState>) {
  if (!isClient()) {
    return;
  }

  const current = loadUserProgress();
  const next: UserProgressState = {
    ...current,
    ...update,
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore write failures
  }
}
export function clearUserProgress() {
  if (!isClient()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore removal failures
  }
}
