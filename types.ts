
export enum GameState {
  LOADING,
  MENU,
  PLAYING,
  GAMEOVER
}

export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
}

export interface Obstacle {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

export const COLORS = {
  primary: "#00ff88",
  danger: "#ff3366",
  bg: "#0a0a0c",
  surface: "#1a1a2e"
};
