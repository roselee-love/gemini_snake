import React from 'react';
import { GameStatus } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  activeMoles: boolean[];
  onWhack: (index: number) => void;
  status: GameStatus;
}

const GameBoard: React.FC<GameBoardProps> = ({ activeMoles, onWhack, status }) => {
  return (
    <div 
      className="relative bg-green-400 border-8 border-green-600 rounded-3xl shadow-[0_10px_0_rgb(22,163,74)] overflow-hidden p-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        aspectRatio: '1/1',
        width: '100%',
        maxWidth: '400px'
      }}
    >
      {/* Grass Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#14532d 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      </div>

      {Array.from({ length: GRID_SIZE }).map((_, index) => {
        const isMoleVisible = activeMoles[index];

        return (
          <div 
            key={index}
            className="relative w-full h-full flex items-end justify-center"
          >
            {/* The Hole */}
            <div className="absolute bottom-2 w-[80%] h-[30%] bg-stone-800 rounded-full opacity-60 shadow-inner"></div>
            
            {/* The Mole */}
            <div 
              className={`
                absolute bottom-4 w-[70%] h-[70%] 
                bg-yellow-300 rounded-t-full rounded-b-2xl border-4 border-yellow-500
                transition-all duration-150 ease-out cursor-pointer select-none
                ${isMoleVisible ? 'translate-y-0 scale-100' : 'translate-y-[120%] scale-90'}
              `}
              onClick={() => isMoleVisible && status === GameStatus.PLAYING && onWhack(index)}
              style={{ willChange: 'transform' }}
            >
                {/* Face */}
                <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-stone-800 rounded-full animate-blink"></div>
                <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-stone-800 rounded-full animate-blink"></div>
                
                {/* Nose */}
                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-5 h-4 bg-pink-400 rounded-full"></div>
                
                {/* Whiskers */}
                <div className="absolute top-[50%] left-0 w-3 h-[2px] bg-stone-700 -rotate-12"></div>
                <div className="absolute top-[55%] left-0 w-3 h-[2px] bg-stone-700 rotate-12"></div>
                <div className="absolute top-[50%] right-0 w-3 h-[2px] bg-stone-700 rotate-12"></div>
                <div className="absolute top-[55%] right-0 w-3 h-[2px] bg-stone-700 -rotate-12"></div>

                {/* Highlight */}
                <div className="absolute top-2 left-4 w-3 h-2 bg-white opacity-40 rounded-full -rotate-45"></div>
            </div>

            {/* Front Dirt/Grass to hide bottom of mole */}
            <div className="absolute bottom-0 w-full h-4 bg-green-500 rounded-b-xl z-10 border-t-4 border-green-600"></div>
          </div>
        );
      })}

      {/* Overlays */}
      {status === GameStatus.IDLE && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20 text-center p-4 rounded-xl">
          <p className="text-white text-2xl font-black drop-shadow-lg mb-2 stroke-black">Ready to Whack?</p>
          <p className="text-white font-bold text-sm bg-pink-500 px-3 py-1 rounded-full shadow-lg">Press Start</p>
        </div>
      )}
      
      {status === GameStatus.PAUSED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 rounded-xl">
          <p className="text-white text-3xl font-black tracking-widest uppercase drop-shadow-md">Paused</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
