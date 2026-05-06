export type Step = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'home' 
  | 'lessons' 
  | 'quiz' 
  | 'milestone' 
  | 'profile' 
  | 'vocab' 
  | 'listen' 
  | 'flashcards';

export interface Progress {
  streak: number;
  xp: number;
  level: number;
  mastery: number;
}
