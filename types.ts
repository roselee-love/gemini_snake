export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinate {
  x: number;
  y: number;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface GameState {
  snake: Coordinate[];
  food: Coordinate;
  direction: Direction;
  score: number;
  highScore: number;
  status: GameStatus;
  speed: number;
}