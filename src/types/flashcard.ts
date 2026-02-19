export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  createdAt: number;
  cards: Flashcard[];
  studySessions?: StudySession[];
}

export interface StudySession {
  id: string;
  setId: string;
  date: number;
  cardsStudied: number;
  duration: number; // in seconds
  correctAnswers?: number;
}

export type ViewState = 'dashboard' | 'editor' | 'study' | 'analytics';

export interface GenerationProgress {
  status: 'idle' | 'reading' | 'generating' | 'success' | 'error';
  message: string;
}

export interface UsageStats {
  totalSets: number;
  totalCards: number;
  totalStudySessions: number;
  totalTimeSpent: number; // in minutes
  cardsStudiedToday: number;
  weeklyProgress: DailyStats[];
}

export interface DailyStats {
  date: string;
  cardsStudied: number;
  timeSpent: number;
  sessions: number;
}
