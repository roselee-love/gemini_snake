import { Coordinate } from './types';

// Grid Dimensions
export const GRID_SIZE = 20;

// Initial Config
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_DECREMENT = 2; // Milliseconds faster per apple

// Initial Snake Position (Center)
export const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION = 'UP';

// Keyboard mappings
export const KEY_CODES = {
  38: 'UP',
  40: 'DOWN',
  37: 'LEFT',
  39: 'RIGHT',
  87: 'UP',    // W
  83: 'DOWN',  // S
  65: 'LEFT',  // A
  68: 'RIGHT', // D
  32: 'SPACE', // Pause/Start
};