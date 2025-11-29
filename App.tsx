import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import GameOverModal from './components/GameOverModal';
import { 
  Direction, 
  GameState, 
  GameStatus, 
  Coordinate 
} from './types';
import { 
  GRID_SIZE, 
  INITIAL_DIRECTION, 
  INITIAL_SNAKE, 
  INITIAL_SPEED, 
  MIN_SPEED, 
  SPEED_DECREMENT,
  KEY_CODES 
} from './constants';

const App: React.FC = () => {
  // State
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION as Direction);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Refs for state accessed inside event listeners/intervals
  const directionRef = useRef<Direction>(INITIAL_DIRECTION as Direction);
  const lastProcessedDirectionRef = useRef<Direction>(INITIAL_DIRECTION as Direction);
  const gameLoopRef = useRef<number | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Utils
  const getRandomCoordinate = useCallback((): Coordinate => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const spawnFood = useCallback((currentSnake: Coordinate[]) => {
    let newFood = getRandomCoordinate();
    while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = getRandomCoordinate();
    }
    setFood(newFood);
  }, [getRandomCoordinate]);

  // Game Logic
  const gameOver = useCallback(() => {
    setStatus(GameStatus.GAME_OVER);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = directionRef.current;
      lastProcessedDirectionRef.current = currentDir;

      const newHead = { ...head };

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check Walls
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      // Check Self Collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        spawnFood(newSnake);
        // Don't pop tail (grow)
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, gameOver, spawnFood]);

  // Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, speed]);

  // Inputs
  const handleDirectionChange = useCallback((newDir: Direction) => {
    const lastDir = lastProcessedDirectionRef.current;
    
    // Prevent 180 degree turns
    const isOpposite = 
      (newDir === 'UP' && lastDir === 'DOWN') ||
      (newDir === 'DOWN' && lastDir === 'UP') ||
      (newDir === 'LEFT' && lastDir === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDir === 'LEFT');

    if (!isOpposite) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // @ts-ignore
    const key = KEY_CODES[e.keyCode];
    
    if (key === 'SPACE') {
      e.preventDefault();
      if (status === GameStatus.GAME_OVER) resetGame();
      else togglePause();
      return;
    }

    if (key && ['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(key)) {
      e.preventDefault();
      if (status === GameStatus.IDLE) setStatus(GameStatus.PLAYING);
      if (status === GameStatus.PLAYING) handleDirectionChange(key as Direction);
    }
  }, [status, handleDirectionChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Actions
  const togglePause = () => {
    if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
    else if (status === GameStatus.PAUSED || status === GameStatus.IDLE) setStatus(GameStatus.PLAYING);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION as Direction);
    directionRef.current = INITIAL_DIRECTION as Direction;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION as Direction;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    spawnFood(INITIAL_SNAKE);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent tracking-tight">
          GEMINI SNAKE
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Powered by React + Tailwind + Google Gemini</p>
      </div>

      <div className="flex items-center justify-between w-full max-w-[500px] mb-4 px-2">
         <div className="text-white">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-mono font-bold">{score}</span>
         </div>
         <div className="text-right text-white">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Best</span>
            <span className="text-2xl font-mono font-bold text-yellow-500">{highScore}</span>
         </div>
      </div>

      <GameBoard snake={snake} food={food} status={status} />
      
      <Controls 
        onDirectionChange={(dir) => {
          if (status === GameStatus.IDLE) setStatus(GameStatus.PLAYING);
          handleDirectionChange(dir);
        }} 
        onToggleGame={togglePause}
        onReset={resetGame}
        status={status}
      />

      <GameOverModal 
        score={score} 
        highScore={highScore} 
        isOpen={status === GameStatus.GAME_OVER} 
        onReset={resetGame} 
      />
    </div>
  );
};

export default App;