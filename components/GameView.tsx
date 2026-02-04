
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { COLORS, Player, Obstacle, Particle } from '../types';

interface GameViewProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  isGameOver: boolean;
  onGameOver: (finalScore: number) => void;
}

const GameView: React.FC<GameViewProps> = ({ 
  score, 
  setScore, 
  level, 
  setLevel, 
  isGameOver, 
  onGameOver 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputs, setInputs] = useState({ left: false, right: false });
  const [isShaking, setIsShaking] = useState(false);
  const requestRef = useRef<number>(null);
  
  const gameStateRef = useRef({
    player: { x: 150, y: 410, w: 36, h: 36, speed: 10 },
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    frames: 0,
    score: 0,
    level: 1,
    spawnRate: 65,
    baseSpeed: 3.5,
    isOver: false,
    width: 360,
    height: 560
  });

  useEffect(() => {
    if (!isGameOver) {
      gameStateRef.current = {
        ...gameStateRef.current,
        player: { x: 162, y: 440, w: 36, h: 36, speed: 10 },
        obstacles: [],
        particles: [],
        frames: 0,
        score: 0,
        level: 1,
        spawnRate: 65,
        baseSpeed: 3.5,
        isOver: false
      };
    }
  }, [isGameOver]);

  const update = useCallback(() => {
    const state = gameStateRef.current;
    if (state.isOver) return;

    if (inputs.left && state.player.x > 0) state.player.x -= state.player.speed;
    if (inputs.right && state.player.x < state.width - state.player.w) state.player.x += state.player.speed;

    if (state.frames % Math.max(12, state.spawnRate) === 0) {
      const size = Math.random() * 30 + 30;
      state.obstacles.push({
        x: Math.random() * (state.width - size),
        y: -size,
        size: size,
        speed: state.baseSpeed + (state.level * 0.6)
      });
    }

    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const o = state.obstacles[i];
      o.y += o.speed;

      const px = state.player.x + state.player.w / 2;
      const py = state.player.y + state.player.h / 2;
      const ox = o.x + o.size / 2;
      const oy = o.y + o.size / 2;
      const dist = Math.sqrt((px - ox) ** 2 + (py - oy) ** 2);
      
      if (dist < (state.player.w / 2 + o.size / 2) - 5) {
        state.isOver = true;
        setIsShaking(true);
        
        // VIBRAÇÃO DO CELULAR (APK FEEL)
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        onGameOver(state.score);
        for (let j = 0; j < 45; j++) {
          state.particles.push({
            x: px, y: py,
            size: Math.random() * 10,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            alpha: 1
          });
        }
        setTimeout(() => setIsShaking(false), 300);
      }

      if (o.y > state.height) {
        state.obstacles.splice(i, 1);
        state.score++;
        setScore(state.score);
        if (state.score > 0 && state.score % 20 === 0) {
          state.level++;
          setLevel(state.level);
          state.spawnRate = Math.max(12, 65 - (state.level * 7));
        }
      }
    }
    state.frames++;
  }, [inputs, onGameOver, setLevel, setScore]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;
    ctx.clearRect(0, 0, state.width, state.height);

    // Grid de Fundo
    ctx.strokeStyle = '#0a2a1a';
    ctx.lineWidth = 0.5;
    for(let i = 0; i < state.width; i += 45) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, state.height); ctx.stroke();
    }
    for(let i = 0; i < state.height; i += 45) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(state.width, i); ctx.stroke();
    }

    // Jogador
    if (!state.isOver) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = COLORS.primary;
      ctx.fillStyle = COLORS.primary;
      ctx.fillRect(state.player.x, state.player.y, state.player.w, state.player.h);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.fillRect(state.player.x + 10, state.player.y + 10, state.player.w - 20, state.player.h - 20);
    }

    // Obstáculos
    state.obstacles.forEach(o => {
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.danger;
      ctx.fillStyle = COLORS.danger;
      ctx.fillRect(o.x, o.y, o.size, o.size);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(o.x + 5, o.y + 5, o.size - 10, o.size - 10);
    });

    // Partículas
    state.particles.forEach((p, i) => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = COLORS.danger;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) state.particles.splice(i, 1);
    });
    ctx.globalAlpha = 1;
  }, []);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) { update(); draw(ctx); }
    }
    requestRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [loop]);

  return (
    <div className={`relative flex flex-col items-center justify-between w-full h-full overflow-hidden transition-all duration-75 ${isShaking ? 'bg-red-900/20 scale-95' : 'bg-black'}`}>
      
      {/* HUD MOBILE */}
      <div className="w-full flex justify-between items-start p-6 z-20 pointer-events-none mt-safe">
        <div className="flex flex-col">
            <span className="text-[10px] text-[#00ff88] font-bold tracking-[0.3em] uppercase opacity-50">Setor Ativo</span>
            <span className="text-3xl font-orbitron font-black text-white">{level}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#00ff88] font-bold tracking-[0.3em] uppercase opacity-50">Score</span>
            <span className="text-5xl font-orbitron font-black text-[#00ff88] drop-shadow-[0_0_10px_#00ff88]">{score}</span>
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        width={360}
        height={560}
        className="w-full h-full absolute inset-0 object-cover opacity-80"
      />

      {/* CONTROLES TIPO APK (GIGANTES) */}
      <div className="w-full flex h-1/3 z-30 mb-safe pointer-events-none">
        <div 
          onPointerDown={(e) => { e.preventDefault(); setInputs(p => ({ ...p, left: true })); }}
          onPointerUp={() => setInputs(p => ({ ...p, left: false }))}
          onPointerLeave={() => setInputs(p => ({ ...p, left: false }))}
          className="flex-1 pointer-events-auto active:bg-white/5 transition-colors flex items-center justify-start p-10 group"
        >
             <div className="w-16 h-16 border-l-4 border-b-4 border-[#00ff88]/30 group-active:border-[#00ff88] rotate-45 transition-colors" />
        </div>
        <div 
          onPointerDown={(e) => { e.preventDefault(); setInputs(p => ({ ...p, right: true })); }}
          onPointerUp={() => setInputs(p => ({ ...p, right: false }))}
          onPointerLeave={() => setInputs(p => ({ ...p, right: false }))}
          className="flex-1 pointer-events-auto active:bg-white/5 transition-colors flex items-center justify-end p-10 group"
        >
             <div className="w-16 h-16 border-r-4 border-t-4 border-[#00ff88]/30 group-active:border-[#00ff88] rotate-45 transition-colors" />
        </div>
      </div>

      <style>{`
        .mt-safe { margin-top: env(safe-area-inset-top); }
        .mb-safe { margin-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

export default GameView;
