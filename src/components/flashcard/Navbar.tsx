import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, Github } from 'lucide-react';

interface NavbarProps {
  onGoHome: () => void;
  onShowAnalytics: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, onShowAnalytics, currentView }) => {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onGoHome}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Note2cards
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={currentView === 'analytics' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={onShowAnalytics}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Usage</span>
            </Button>
            
          </div>
        </div>
      </div>
    </nav>
  );
};
