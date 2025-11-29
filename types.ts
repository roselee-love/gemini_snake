export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface GameState {
  activeMoles: boolean[];
  score: number;
  highScore: number;
  status: GameStatus;
  timeLeft: number;
}
