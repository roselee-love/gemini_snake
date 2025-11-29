import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Loader2, MessageSquareQuote } from 'lucide-react';
import { getGameOverCommentary } from '../services/geminiService';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onReset: () => void;
  isOpen: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onReset, isOpen }) => {
  const [commentary, setCommentary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setCommentary(null);
      getGameOverCommentary(score, highScore)
        .then(text => {
          setCommentary(text);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, score, highScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
        
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-1">GAME OVER</h2>
          <p className="text-gray-400">Snake collided!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Score</p>
            <p className="text-3xl font-bold text-white">{score}</p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Best</p>
            <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>

        {/* AI Commentary Section */}
        <div className="mb-8 min-h-[80px] flex items-center justify-center">
            {loading ? (
                <div className="flex items-center gap-2 text-indigo-400">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm font-medium">Asking AI for feedback...</span>
                </div>
            ) : (
                <div className="relative bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl w-full">
                     <MessageSquareQuote className="absolute -top-3 -left-2 text-indigo-400 bg-gray-800 rounded-full p-1" size={24} />
                     <p className="text-indigo-200 text-sm italic font-medium leading-relaxed">
                        "{commentary}"
                     </p>
                </div>
            )}
        </div>

        <button
          onClick={onReset}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        >
          <RefreshCw size={20} />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;