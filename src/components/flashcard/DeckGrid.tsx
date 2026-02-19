import React from 'react';
import { FlashcardSet } from '@/types/flashcard';
import { DeckCard } from './DeckCard';
import { Inbox, Sparkles } from 'lucide-react';

interface DeckGridProps {
  sets: FlashcardSet[];
  onStudy: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DeckGrid: React.FC<DeckGridProps> = ({ sets, onStudy, onDelete }) => {
  if (sets.length === 0) {
    return (
      <div className="bg-card border-2 border-dashed border-border rounded-2xl p-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground mb-6">
          <Inbox className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No decks yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Upload your first PDF to get started with AI-powered flashcards.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sets.map((set, index) => (
        <div key={set.id} style={{ animationDelay: `${index * 50}ms` }}>
          <DeckCard set={set} onStudy={onStudy} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};
