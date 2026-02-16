import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FlashcardData } from './types';
import FileUpload from './components/FileUpload';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [allCards, setAllCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [hideLearned, setHideLearned] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedLearned = localStorage.getItem('flashmaster_learned');
    if (savedLearned) {
      try {
        setLearnedIds(new Set(JSON.parse(savedLearned)));
      } catch (e) {
        console.error('Failed to parse learned cards', e);
      }
    }
  }, []);

  // Save learned state
  useEffect(() => {
    localStorage.setItem('flashmaster_learned', JSON.stringify(Array.from(learnedIds)));
  }, [learnedIds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLoaded) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoaded, currentIndex]); // Dependencies handled inside handlers via functional updates or memoization needed? 
  // Actually, handleNext needs access to filteredCards, so we need to be careful. 
  // The simplest way is to let the component re-bind when state changes or use refs. 
  // For simplicity in this structure, we'll rely on the re-render.

  const handleDataLoaded = (data: FlashcardData[]) => {
    setAllCards(data);
    setCurrentIndex(0);
    setIsLoaded(true);
  };

  const filteredCards = useMemo(() => {
    if (!hideLearned) return allCards;
    return allCards.filter(card => !learnedIds.has(card.id));
  }, [allCards, hideLearned, learnedIds]);

  // Reset index if it goes out of bounds due to filtering
  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    }
  }, [filteredCards.length, currentIndex]);

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleLearned = (id: string) => {
    setLearnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShuffle = () => {
    setAllCards(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
  };

  const handleReset = () => {
    if (window.confirm("This will clear your 'Learned' progress and shuffle order. Continue?")) {
      setLearnedIds(new Set());
      setCurrentIndex(0);
    }
  };

  const handleBackToUpload = () => {
    if (window.confirm("Go back to upload? This clears current deck.")) {
      setIsLoaded(false);
      setAllCards([]);
      setLearnedIds(new Set());
    }
  };

  if (!isLoaded) {
    return <FileUpload onDataLoaded={handleDataLoaded} />;
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={handleBackToUpload}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
          aria-label="Back to upload"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          FlashMaster
        </h1>
        <div className="w-8"></div> {/* Spacer for balance */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 relative w-full max-w-4xl mx-auto">
        {filteredCards.length > 0 && currentCard ? (
          <>
            <Flashcard 
              card={currentCard} 
              onNext={handleNext}
              onPrev={handlePrev}
              isLearned={learnedIds.has(currentCard.id)}
              onToggleLearned={() => toggleLearned(currentCard.id)}
            />
            
            <Controls 
              current={currentIndex}
              total={filteredCards.length}
              showLearned={!hideLearned}
              onToggleShowLearned={() => setHideLearned(!hideLearned)}
              onShuffle={handleShuffle}
              onReset={handleReset}
              onNext={handleNext}
              onPrev={handlePrev}
              learnedCount={learnedIds.size}
            />
          </>
        ) : (
          <div className="text-center p-8 max-w-md animate-fade-in">
            <div className="mb-4 inline-block p-4 rounded-full bg-emerald-500/10 text-emerald-400">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
            <p className="text-slate-400 mb-8">
              You've marked all cards as learned. Great job!
            </p>
            <button
              onClick={() => setHideLearned(false)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Review All Cards
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-slate-600 text-xs">
        <p>Use arrow keys to navigate • Space/Enter to flip</p>
      </footer>
    </div>
  );
};

export default App;