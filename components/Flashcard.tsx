import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { FlashcardData } from '../types';
import { Check, Info } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardData;
  onNext: () => void;
  onPrev: () => void;
  isLearned: boolean;
  onToggleLearned: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onNext, onPrev, isLearned, onToggleLearned }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setDragDirection(null);
  }, [card.id]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onPrev();
    } else if (info.offset.x < -threshold) {
      onNext();
    }
    setDragDirection(null);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) setDragDirection('right');
    else if (info.offset.x < -50) setDragDirection('left');
    else setDragDirection(null);
  };

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className="relative w-full max-w-lg h-[400px] perspective-1000 mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          className="w-full h-full relative cursor-pointer"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          onClick={toggleFlip}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ perspective: 1000 }}
          role="button"
          aria-label={`Flashcard: ${isFlipped ? 'Answer revealed' : 'Question'}. Click to flip.`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleFlip();
            }
          }}
        >
          <motion.div
            className="w-full h-full relative preserve-3d transition-all duration-500 ease-in-out-back"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden w-full h-full">
              <div className="w-full h-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                
                <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-slate-500 uppercase">Question</span>
                
                {isLearned && (
                  <div className="absolute top-6 right-6 text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Learned
                  </div>
                )}
                
                <div className="flex-1 flex items-center justify-center w-full">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
                    {card.question}
                  </h2>
                </div>

                <div className="mt-4 text-slate-500 text-sm flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Info className="w-4 h-4" /> Tap to reveal answer
                </div>
              </div>
            </div>

            {/* Back Face */}
            <div 
              className="absolute inset-0 backface-hidden w-full h-full" 
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="w-full h-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                
                <span className="absolute top-6 left-6 text-xs font-bold tracking-wider text-slate-500 uppercase">Answer</span>
                
                <div className="flex-1 flex items-center justify-center w-full overflow-y-auto custom-scrollbar">
                  <p className="text-xl sm:text-2xl text-slate-300 font-medium leading-relaxed">
                    {card.answer}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLearned();
                  }}
                  className={`mt-6 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                    ${isLearned 
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                >
                  <Check className={`w-4 h-4 ${isLearned ? 'opacity-100' : 'opacity-50'}`} />
                  {isLearned ? 'Marked as Learned' : 'Mark as Learned'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Swipe Indicators */}
          <AnimatePresence>
            {dragDirection === 'right' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-lg font-bold shadow-lg pointer-events-none z-20"
              >
                Previous
              </motion.div>
            )}
            {dragDirection === 'left' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-lg font-bold shadow-lg pointer-events-none z-20"
              >
                Next
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default Flashcard;