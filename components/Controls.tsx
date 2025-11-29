import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { GameStatus } from '../types';

interface ControlsProps {
  onToggleGame: () => void;
  onReset: () => void;
  status: GameStatus;
}

const Controls: React.FC<ControlsProps> = ({ onToggleGame, onReset, status }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[400px] mt-8">
      <div className="flex justify-center gap-4 w-full">
         {status === GameStatus.GAME_OVER ? (
            <button 
              onClick={onReset}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-300 rounded-2xl text-yellow-900 font-black text-lg shadow-[0_6px_0_rgb(202,138,4)] active:shadow-none active:translate-y-[6px] transition-all"
            >
              <RefreshCw size={24} /> Play Again
            </button>
         ) : (
            <button 
              onClick={onToggleGame}
              className={`
                flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl text-white font-black text-lg shadow-lg active:scale-95 transition-all
                ${status === GameStatus.PLAYING 
                  ? 'bg-amber-500 hover:bg-amber-400 shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[6px]' 
                  : 'bg-pink-500 hover:bg-pink-400 shadow-[0_6px_0_rgb(190,24,93)] active:shadow-none active:translate-y-[6px]'
                }
              `}
            >
              {status === GameStatus.PLAYING ? <><Pause size={24}/> Pause</> : <><Play size={24}/> Start Game</>}
            </button>
         )}
      </div>
      
      <div className="text-pink-800/60 font-medium text-sm mt-2 text-center bg-white/50 px-4 py-2 rounded-full">
         Tap the moles as fast as you can!
      </div>
    </div>
  );
};

export default Controls;
