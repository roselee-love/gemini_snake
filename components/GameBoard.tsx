import React from 'react';
import { Coordinate, GameStatus } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  status: GameStatus;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, status }) => {
  // Create a 1D array representing the grid for rendering
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  // Helper to check if a cell is part of the snake
  const getSnakeSegmentIndex = (x: number, y: number) => {
    return snake.findIndex(segment => segment.x === x && segment.y === y);
  };

  const isFood = (x: number, y: number) => food.x === x && food.y === y;

  return (
    <div 
      className="relative bg-gray-900 border-4 border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        width: '100%',
        maxWidth: '500px'
      }}
    >
      {gridCells.map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        
        const snakeIndex = getSnakeSegmentIndex(x, y);
        const isSnakeHead = snakeIndex === 0;
        const isSnakeBody = snakeIndex > 0;
        const isFoodCell = isFood(x, y);

        return (
          <div 
            key={`${x}-${y}`}
            className={`
              w-full h-full border-[0.5px] border-gray-800/30
              transition-all duration-100
              ${isSnakeHead ? 'bg-emerald-400 z-10 rounded-sm' : ''}
              ${isSnakeBody ? 'bg-emerald-600/80 rounded-sm' : ''}
              ${isFoodCell ? 'bg-red-500 rounded-full scale-75 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]' : ''}
            `}
          >
            {isSnakeHead && (
               <div className="w-full h-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-black rounded-full opacity-50"></div>
                 <div className="w-0.5"></div>
                 <div className="w-1.5 h-1.5 bg-black rounded-full opacity-50"></div>
               </div>
            )}
          </div>
        );
      })}

      {/* Overlays */}
      {status === GameStatus.IDLE && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 text-center p-4">
          <p className="text-white text-lg font-bold mb-2">Ready?</p>
          <p className="text-gray-300 text-sm">Press Space or Start Button</p>
        </div>
      )}
      
      {status === GameStatus.PAUSED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
          <p className="text-white text-2xl font-black tracking-widest uppercase">Paused</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;