import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RefreshCw } from 'lucide-react';
import { Direction, GameStatus } from '../types';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onToggleGame: () => void;
  onReset: () => void;
  status: GameStatus;
}

const Controls: React.FC<ControlsProps> = ({ onDirectionChange, onToggleGame, onReset, status }) => {
  const btnClass = "p-4 bg-gray-800 rounded-xl shadow-lg active:bg-gray-700 active:scale-95 transition-all text-white border-b-4 border-gray-900 active:border-b-0 active:mt-1 select-none touch-manipulation";

  return (
    <div className="flex flex-col gap-4 w-full max-w-[500px] mt-4">
      {/* Game State Controls */}
      <div className="flex justify-center gap-4 mb-2">
         {status === GameStatus.GAME_OVER ? (
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold shadow-lg transition-colors"
            >
              <RefreshCw size={20} /> Play Again
            </button>
         ) : (
            <button 
              onClick={onToggleGame}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold shadow-lg transition-colors ${status === GameStatus.PLAYING ? 'bg-amber-600 hover:bg-amber-500' : 'bg-green-600 hover:bg-green-500'}`}
            >
              {status === GameStatus.PLAYING ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Start</>}
            </button>
         )}
      </div>

      {/* D-Pad for Mobile */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto md:hidden">
        <div className="col-start-2">
          <button 
            className={btnClass} 
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange('UP'); }}
            onClick={() => onDirectionChange('UP')}
            aria-label="Up"
          >
            <ArrowUp size={24} />
          </button>
        </div>
        <div className="col-start-1 row-start-2">
          <button 
            className={btnClass} 
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange('LEFT'); }}
            onClick={() => onDirectionChange('LEFT')}
            aria-label="Left"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="col-start-2 row-start-2">
          <button 
            className={btnClass} 
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange('DOWN'); }}
            onClick={() => onDirectionChange('DOWN')}
            aria-label="Down"
          >
            <ArrowDown size={24} />
          </button>
        </div>
        <div className="col-start-3 row-start-2">
          <button 
            className={btnClass} 
            onTouchStart={(e) => { e.preventDefault(); onDirectionChange('RIGHT'); }}
            onClick={() => onDirectionChange('RIGHT')}
            aria-label="Right"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
      
      <div className="hidden md:flex justify-center text-gray-500 text-sm mt-2">
         Use Arrow Keys or WASD to move. Space to Start/Pause.
      </div>
    </div>
  );
};

export default Controls;