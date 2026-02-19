import React, { useState, useEffect } from 'react';
import { FlashcardSet } from '@/types/flashcard';
import { Button } from '@/components/ui/button';
import { FlashcardItem } from './FlashcardItem';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StudyViewProps {
  set: FlashcardSet;
  onExit: (duration: number, cardsStudied: number) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ set, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const totalCards = set.cards.length;
  const currentCard = set.cards[currentIndex];
  const progress = ((currentIndex + 1) / totalCards) * 100;

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleExit = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    onExit(duration, currentIndex + 1);
  };

  if (!currentCard) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{set.name}</h2>
          <div className="flex items-center gap-4 text-muted-foreground mt-1">
            <span>Card {currentIndex + 1} of {totalCards}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleExit} className="gap-2">
          <X className="h-4 w-4" />
          Exit Study Mode
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Progress bar */}
        <div className="w-full mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        <FlashcardItem key={currentCard.id} card={currentCard} />

        {/* Navigation */}
        <div className="mt-12 flex gap-4 w-full">
          <Button 
            className="flex-1 gap-2" 
            variant="outline" 
            size="lg" 
            onClick={prevCard}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>
          <Button 
            className="flex-1 gap-2" 
            size="lg" 
            onClick={currentIndex === totalCards - 1 ? handleExit : nextCard}
          >
            {currentIndex === totalCards - 1 ? 'Finish' : 'Next Card'}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
