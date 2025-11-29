import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import GameOverModal from './components/GameOverModal';
import { 
  GameStatus, 
} from './types';
import { 
  GRID_SIZE, 
  INITIAL_MOLES, 
  GAME_DURATION,
  MOLE_STAY_DURATION,
  MOLE_SPAWN_INTERVAL
} from './constants';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  // State
  const [activeMoles, setActiveMoles] = useState<boolean[]>(INITIAL_MOLES);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  // Refs
  const timerRef = useRef<number | null>(null);
  const spawnerRef = useRef<number | null>(null);
  const moleTimeoutsRef = useRef<{ [key: number]: number }>({});

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('whack-a-mole-high-score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Game Logic
  const gameOver = useCallback(() => {
    setStatus(GameStatus.GAME_OVER);
    audioService.playGameOver(); // Sound Effect

    // Clear all intervals and timeouts
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);
    Object.values(moleTimeoutsRef.current).forEach((id) => clearTimeout(id as number));
    setActiveMoles(INITIAL_MOLES);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whack-a-mole-high-score', score.toString());
    }
  }, [score, highScore]);

  const spawnMole = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * GRID_SIZE);
    
    setActiveMoles(prev => {
      // Don't spawn if already active
      if (prev[randomIndex]) return prev;

      const newMoles = [...prev];
      newMoles[randomIndex] = true;
      
      // Schedule hiding this mole
      const timeoutId = window.setTimeout(() => {
         setActiveMoles(current => {
           const updated = [...current];
           updated[randomIndex] = false;
           return updated;
         });
         delete moleTimeoutsRef.current[randomIndex];
      }, MOLE_STAY_DURATION); // Could make this dynamic for difficulty

      moleTimeoutsRef.current[randomIndex] = timeoutId;
      
      return newMoles;
    });
  }, []);

  // Timer Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            gameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnerRef.current = window.setInterval(spawnMole, MOLE_SPAWN_INTERVAL); // Spawn rate
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, [status, gameOver, spawnMole]);

  // Actions
  const handleWhack = (index: number) => {
    if (status !== GameStatus.PLAYING) return;
    
    audioService.playWhack(); // Sound Effect

    // Hide mole immediately
    setActiveMoles(prev => {
      const newMoles = [...prev];
      newMoles[index] = false;
      return newMoles;
    });

    // Clear the auto-hide timeout for this mole since we whacked it
    if (moleTimeoutsRef.current[index]) {
      clearTimeout(moleTimeoutsRef.current[index]);
      delete moleTimeoutsRef.current[index];
    }

    setScore(s => s + 1);
  };

  const togglePause = () => {
    if (status === GameStatus.PLAYING) {
        setStatus(GameStatus.PAUSED);
    } else {
        if (status === GameStatus.IDLE) {
            audioService.playStart(); // Sound Effect only on fresh start
        }
        setStatus(GameStatus.PLAYING);
    }
  };

  const resetGame = () => {
    audioService.playStart(); // Sound Effect
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveMoles(INITIAL_MOLES);
    setStatus(GameStatus.PLAYING);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-black text-pink-500 drop-shadow-[0_4px_0_rgba(255,255,255,0.8)] tracking-tight">
          WHACK-A-MOLE
        </h1>
        <p className="text-pink-400 mt-2 text-sm font-bold bg-white/50 px-4 py-1 rounded-full inline-block">
          Powered by Gemini AI
        </p>
      </div>

      <div className="flex items-center justify-between w-full max-w-[400px] mb-4 px-4 bg-white/60 p-3 rounded-2xl shadow-sm border border-white">
         <div className="text-left">
            <span className="text-pink-400 text-[10px] font-black uppercase tracking-wider block">Time</span>
            <span className={`text-3xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
              {timeLeft}s
            </span>
         </div>
         
         <div className="text-center px-4">
             <div className="text-center">
                <span className="text-pink-400 text-[10px] font-black uppercase tracking-wider block">Score</span>
                <span className="text-4xl font-black text-pink-600">{score}</span>
             </div>
         </div>

         <div className="text-right">
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-wider block">Best</span>
            <span className="text-3xl font-black text-yellow-500">{highScore}</span>
         </div>
      </div>

      <GameBoard activeMoles={activeMoles} onWhack={handleWhack} status={status} />
      
      <Controls 
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