import React, { useState } from 'react';
import { 
  Navbar, 
  StudyView, 
  UploadSection, 
  DeckGrid, 
  AnalyticsDashboard 
} from '@/components/flashcard';
import { useFlashcards } from '@/hooks/useFlashcards';
import { FlashcardSet, ViewState, GenerationProgress } from '@/types/flashcard';
import { generateFlashcardsFromPDF } from '@/services/geminiService';
import { Layers } from 'lucide-react';

const Index: React.FC = () => {
  const { sets, addSet, deleteSet, recordSession, getUsageStats } = useFlashcards();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({ status: 'idle', message: '' });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setProgress({ status: 'reading', message: 'Reading PDF content...' });
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = (e.target?.result as string).split(',')[1];
        setProgress({ status: 'generating', message: 'AI is distilling knowledge into cards...' });
        
        const generatedCards = await generateFlashcardsFromPDF(base64Data, file.name);
        
        const newSet: FlashcardSet = {
          id: Date.now().toString(),
          name: file.name.replace('.pdf', ''),
          createdAt: Date.now(),
          cards: generatedCards,
        };

        addSet(newSet);
        setProgress({ status: 'success', message: 'Successfully generated!' });
        setTimeout(() => setProgress({ status: 'idle', message: '' }), 2000);
      } catch (error) {
        console.error(error);
        setProgress({ status: 'error', message: 'Failed to generate flashcards. Please check your API key.' });
        setTimeout(() => setProgress({ status: 'idle', message: '' }), 4000);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input value to allow re-uploading same file
    event.target.value = '';
  };

  const handleStudy = (id: string) => {
    setActiveSetId(id);
    setCurrentView('study');
  };

  const handleExitStudy = (duration: number, cardsStudied: number) => {
    if (activeSetId) {
      recordSession({
        setId: activeSetId,
        date: Date.now(),
        cardsStudied,
        duration,
      });
    }
    setActiveSetId(null);
    setCurrentView('dashboard');
  };

  const activeSet = sets.find(s => s.id === activeSetId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        onGoHome={() => setCurrentView('dashboard')} 
        onShowAnalytics={() => setCurrentView('analytics')}
        currentView={currentView}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Study View */}
        {currentView === 'study' && activeSet && (
          <StudyView set={activeSet} onExit={handleExitStudy} />
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <AnalyticsDashboard 
            stats={getUsageStats()} 
            onBack={() => setCurrentView('dashboard')} 
          />
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Transform PDFs into <span className="text-secondary">Smart Flashcards</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload any document and let AI extract key concepts into interactive study cards,To 
                Learn faster.
              </p>
            </div>

            {/* Upload Section */}
            <UploadSection progress={progress} onFileUpload={handleFileUpload} />

            {/* Decks Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">Your Decks</h2>
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                    {sets.length} total
                  </span>
                </div>
              </div>

              <DeckGrid sets={sets} onStudy={handleStudy} onDelete={deleteSet} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Copyright © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
