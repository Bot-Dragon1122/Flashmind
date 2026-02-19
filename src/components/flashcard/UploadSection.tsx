import React from 'react';
import { GenerationProgress } from '@/types/flashcard';
import { Upload, Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface UploadSectionProps {
  progress: GenerationProgress;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ progress, onFileUpload }) => {
  return (
    <section className="relative bg-card rounded-3xl shadow-elevated border border-border p-8 md:p-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Generate Flashcards</h2>
        </div>
        <p className="text-muted-foreground mb-8 ml-[52px]">
          Upload a PDF and let AI extract key concepts into study cards
        </p>

        <div className="group">
          <input
            type="file"
            accept=".pdf"
            onChange={onFileUpload}
            className="hidden"
            id="pdf-upload"
            disabled={progress.status !== 'idle' && progress.status !== 'success' && progress.status !== 'error'}
          />
          <label
            htmlFor="pdf-upload"
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all
              ${progress.status === 'idle' ? 'border-border hover:border-secondary hover:bg-secondary/5' : ''}
              ${progress.status === 'reading' || progress.status === 'generating' ? 'border-secondary bg-secondary/5' : ''}
              ${progress.status === 'success' ? 'border-green-500 bg-green-50' : ''}
              ${progress.status === 'error' ? 'border-destructive bg-destructive/5' : ''}
            `}
          >
            {progress.status === 'idle' && (
              <>
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8" />
                </div>
                <span className="text-lg font-semibold text-foreground">Upload PDF to generate</span>
                <span className="text-sm text-muted-foreground mt-1">Files up to 20MB supported</span>
              </>
            )}
            {(progress.status === 'reading' || progress.status === 'generating') && (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-secondary animate-spin mb-4" />
                <span className="text-lg font-semibold text-secondary animate-pulse">{progress.message}</span>
              </div>
            )}
            {progress.status === 'success' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-secondary" />
                </div>
                <span className="text-lg font-semibold text-secondary">{progress.message}</span>
              </div>
            )}
            {progress.status === 'error' && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <span className="text-lg font-semibold text-destructive">{progress.message}</span>
              </div>
            )}
          </label>
        </div>
      </div>
    </section>
  );
};
