
export enum GameState {
  LOADING,
  MENU,
  SHOP,
  PLAYING,
  GAMEOVER
}

export interface Weapon {
  id: string;
  name: string;
  price: number;
  fireRate: number;
  damage: number;
  type: 'single' | 'double' | 'triple' | 'plasma';
  unlocked: boolean;
}

export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  accel: number;
  friction: number;
  maxSpeed: number;
}

export interface Obstacle {
  x: number;
  y: number;
  size: number;
  speed: number;
  health: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  damage: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const COLORS = {
  primary: "#00ff88",
  secondary: "#00ccff",
  danger: "#ff3366",
  warning: "#ffcc00",
  bg: "#0a0a0c",
  surface: "#1a1a2e"
};

export const INITIAL_WEAPONS: Weapon[] = [
  { id: 'w1', name: 'NEON BLASTER', price: 0, fireRate: 25, damage: 1, type: 'single', unlocked: true },
  { id: 'w2', name: 'RAPID STRIKE', price: 500, fireRate: 15, damage: 1, type: 'single', unlocked: false },
  { id: 'w3', name: 'TWIN LASER', price: 1500, fireRate: 20, damage: 1, type: 'double', unlocked: false },
  { id: 'w4', name: 'PLASMA PULSE', price: 3500, fireRate: 12, damage: 2, type: 'plasma', unlocked: false }
];
