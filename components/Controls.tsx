import React from 'react';
import { Shuffle, RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface ControlsProps {
  current: number;
  total: number;
  showLearned: boolean;
  onToggleShowLearned: () => void;
  onShuffle: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
  learnedCount: number;
}

const Controls: React.FC<ControlsProps> = ({
  current,
  total,
  showLearned,
  onToggleShowLearned,
  onShuffle,
  onReset,
  onNext,
  onPrev,
  learnedCount
}) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-8 px-4">
      {/* Primary Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrev}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous card"
          disabled={total === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white tracking-tight font-mono">
            {total > 0 ? current + 1 : 0} <span className="text-slate-600">/</span> {total}
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
            Card Index
          </span>
        </div>

        <button
          onClick={onNext}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next card"
          disabled={total === 0}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${total > 0 ? ((current + 1) / total) * 100 : 0}%` }}
        />
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onShuffle}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-indigo-400 transition-all group"
          title="Shuffle Deck"
        >
          <Shuffle className="w-5 h-5 mb-1 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-xs font-medium">Shuffle</span>
        </button>

        <button
          onClick={onReset}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-indigo-400 transition-all group"
          title="Reset Progress"
        >
          <RotateCcw className="w-5 h-5 mb-1 group-hover:-rotate-90 transition-transform duration-300" />
          <span className="text-xs font-medium">Reset</span>
        </button>

        <button
          onClick={onToggleShowLearned}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all group
            ${!showLearned 
              ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          title={showLearned ? "Show All Cards" : "Hide Learned Cards"}
        >
          {showLearned ? <Eye className="w-5 h-5 mb-1" /> : <EyeOff className="w-5 h-5 mb-1" />}
          <span className="text-xs font-medium">{showLearned ? 'All' : 'Hide Done'}</span>
        </button>

        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 cursor-default">
          <BookOpen className="w-5 h-5 mb-1 text-emerald-500" />
          <span className="text-xs font-medium">{learnedCount} Learned</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;