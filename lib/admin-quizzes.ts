export type QuizQuestionDraft = {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
};

export type StoredQuiz = {
  id: string;
  language: string;
  level: string;
  quizNumber: string;
  questions: QuizQuestionDraft[];
  updatedAt: string;
};

const STORAGE_KEY = 'nilingua-admin-quizzes';

export function createQuizId(language: string, level: string, quizNumber: string) {
  return `${language}-${level}-${quizNumber.trim().padStart(2, '0')}`.toLowerCase();
}

export function getStoredQuizzes(): StoredQuiz[] {
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

export function saveStoredQuiz(quiz: StoredQuiz) {
  if (typeof window === 'undefined') {
    return [];
  }

  const quizzes = getStoredQuizzes();
  const nextQuizzes = [
    ...quizzes.filter((item) => item.id !== quiz.id),
    quiz,
  ].sort((a, b) => a.language.localeCompare(b.language) || a.level.localeCompare(b.level) || a.quizNumber.localeCompare(b.quizNumber));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextQuizzes));
  return nextQuizzes;
}

export function upsertStoredQuiz(previousId: string, quiz: StoredQuiz) {
  if (typeof window === 'undefined') {
    return [];
  }

  const quizzes = getStoredQuizzes();
  const nextQuizzes = [
    ...quizzes.filter((item) => item.id !== previousId && item.id !== quiz.id),
    quiz,
  ].sort((a, b) => a.language.localeCompare(b.language) || a.level.localeCompare(b.level) || a.quizNumber.localeCompare(b.quizNumber));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextQuizzes));
  return nextQuizzes;
}
