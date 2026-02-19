import React from 'react';
import { FlashcardSet } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { Layers, Trash2, Play, Calendar } from 'lucide-react';

interface DeckCardProps {
  set: FlashcardSet;
  onStudy: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ set, onStudy, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this deck?')) {
      onDelete(set.id);
    }
  };

  return (
    <div 
      className="group bg-card rounded-2xl shadow-soft border border-border hover:shadow-elevated hover:border-secondary/30 transition-all p-6 flex flex-col animate-slide-up"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
          <Layers className="h-6 w-6" />
        </div>
        <button 
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive transition-colors p-2 opacity-0 group-hover:opacity-100"
          aria-label="Delete deck"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors mb-2 line-clamp-2">
        {set.name}
      </h3>
      
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
        <span className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          {set.cards.length} cards
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(set.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {/* Action */}
      <Button 
        onClick={() => onStudy(set.id)} 
        className="w-full mt-auto gap-2"
      >
        <Play className="h-4 w-4" />
        Study Now
      </Button>
    </div>
  );
};
