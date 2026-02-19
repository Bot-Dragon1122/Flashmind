import React, { useState } from 'react';
import { Flashcard } from '@/types/flashcard';
import { RotateCcw } from 'lucide-react';

interface FlashcardItemProps {
  card: Flashcard;
  isFlippedGlobal?: boolean;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({ card, isFlippedGlobal }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Use either local flip state or a global override (like "Show All Answers")
  const flipped = isFlippedGlobal !== undefined ? isFlippedGlobal : isFlipped;

  return (
    <div 
      className="relative w-full h-72 perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front - Question */}
        <div className="absolute inset-0 backface-hidden bg-card rounded-2xl shadow-elevated border border-border flex flex-col p-8 items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">Question</span>
          <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">{card.question}</p>
          <div className="mt-auto flex items-center gap-2 text-muted-foreground text-xs">
            <RotateCcw className="h-3 w-3" />
            <span>Click to flip</span>
          </div>
        </div>

        {/* Back - Answer */}
        <div className="absolute inset-0 backface-hidden bg-secondary/10 rounded-2xl shadow-elevated border border-secondary/20 flex flex-col p-8 items-center justify-center text-center rotate-y-180">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">Answer</span>
          <p className="text-base md:text-lg text-foreground leading-relaxed">{card.answer}</p>
          <div className="mt-auto flex items-center gap-2 text-muted-foreground text-xs">
            <RotateCcw className="h-3 w-3" />
            <span>Click to reveal question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
