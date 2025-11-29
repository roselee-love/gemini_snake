import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Loader2, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border-4 border-pink-300 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
        
        <div className="mb-6 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-500 mb-2 shadow-inner">
            <Trophy size={40} className="drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-black text-pink-500 mb-1 drop-shadow-sm">TIME'S UP!</h2>
          <p className="text-gray-400 font-medium">Moles are sleeping...</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-100">
            <p className="text-pink-400 text-xs uppercase tracking-wider font-bold">Score</p>
            <p className="text-4xl font-black text-pink-600">{score}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-100">
            <p className="text-yellow-400 text-xs uppercase tracking-wider font-bold">Best</p>
            <p className="text-4xl font-black text-yellow-500">{highScore}</p>
          </div>
        </div>

        {/* AI Commentary Section */}
        <div className="mb-8 min-h-[80px] flex items-center justify-center">
            {loading ? (
                <div className="flex items-center gap-2 text-pink-400">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-sm font-bold">Magic Mirror is thinking...</span>
                </div>
            ) : (
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 p-4 rounded-2xl w-full">
                     <Sparkles className="absolute -top-3 -left-2 text-yellow-400 fill-yellow-400" size={24} />
                     <p className="text-purple-800 text-sm font-medium italic leading-relaxed">
                        "{commentary}"
                     </p>
                </div>
            )}
        </div>

        <button
          onClick={onReset}
          className="w-full py-4 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[6px]"
        >
          <RefreshCw size={24} />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
