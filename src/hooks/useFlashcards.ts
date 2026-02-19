import { useState, useEffect, useCallback } from 'react';
import { FlashcardSet, StudySession, UsageStats, DailyStats } from '@/types/flashcard';

const STORAGE_KEY = 'flashmind_sets';
const SESSIONS_KEY = 'flashmind_sessions';

export const useFlashcards = () => {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSets = localStorage.getItem(STORAGE_KEY);
    const savedSessions = localStorage.getItem(SESSIONS_KEY);
    
    if (savedSets) {
      setSets(JSON.parse(savedSets));
    }
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sets to localStorage
  const saveSets = useCallback((newSets: FlashcardSet[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSets));
    setSets(newSets);
  }, []);

  // Save sessions to localStorage
  const saveSessions = useCallback((newSessions: StudySession[]) => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    setSessions(newSessions);
  }, []);

  // Add a new set
  const addSet = useCallback((set: FlashcardSet) => {
    const newSets = [set, ...sets];
    saveSets(newSets);
  }, [sets, saveSets]);

  // Delete a set
  const deleteSet = useCallback((id: string) => {
    const newSets = sets.filter(s => s.id !== id);
    saveSets(newSets);
  }, [sets, saveSets]);

  // Record a study session
  const recordSession = useCallback((session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
    };
    const newSessions = [newSession, ...sessions];
    saveSessions(newSessions);
    return newSession;
  }, [sessions, saveSessions]);

  // Calculate usage statistics
  const getUsageStats = useCallback((): UsageStats => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = today - 7 * 24 * 60 * 60 * 1000;

    // Get sessions from the last 7 days
    const weekSessions = sessions.filter(s => s.date >= weekAgo);
    const todaySessions = sessions.filter(s => s.date >= today);

    // Calculate weekly progress
    const weeklyProgress: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = today - i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const daySessions = sessions.filter(s => s.date >= dayStart && s.date < dayEnd);
      
      const date = new Date(dayStart);
      weeklyProgress.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        cardsStudied: daySessions.reduce((sum, s) => sum + s.cardsStudied, 0),
        timeSpent: Math.round(daySessions.reduce((sum, s) => sum + s.duration, 0) / 60),
        sessions: daySessions.length,
      });
    }

    return {
      totalSets: sets.length,
      totalCards: sets.reduce((sum, s) => sum + s.cards.length, 0),
      totalStudySessions: sessions.length,
      totalTimeSpent: Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60),
      cardsStudiedToday: todaySessions.reduce((sum, s) => sum + s.cardsStudied, 0),
      weeklyProgress,
    };
  }, [sets, sessions]);

  return {
    sets,
    sessions,
    addSet,
    deleteSet,
    recordSession,
    getUsageStats,
  };
};
