
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { COLORS, Obstacle, Particle, Projectile, Weapon } from '../types';

interface GameViewProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  setLevel: (lvl: number) => void;
  currentWeapon: Weapon;
  isGameOver: boolean;
  onGameOver: (finalScore: number) => void;
}

const getSectorTheme = (level: number) => {
  const themes = [
    { enemy: '#ff3366', grid: '#05120a', name: 'NEON' },      // 1
    { enemy: '#00ccff', grid: '#050a12', name: 'CYBER' },     // 2
    { enemy: '#bf00ff', grid: '#0a0512', name: 'VOID' },      // 3
    { enemy: '#ff9900', grid: '#120a05', name: 'PLASMA' },    // 4
    { enemy: '#ffffff', grid: '#0f0f0f', name: 'CHROME' },    // 5
    { enemy: '#00ff88', grid: '#0a1205', name: 'TOXIC' },     // 6
    { enemy: '#ffcc00', grid: '#121205', name: 'GOLD' },      // 7
    { enemy: '#33ffcc', grid: '#051212', name: 'TEAL' },      // 8
    { enemy: '#ff5500', grid: '#120500', name: 'EMBER' },     // 9
    { enemy: '#ff0000', grid: '#1a0000', name: 'CORE' },      // 10
  ];
  return themes[Math.min(level - 1, themes.length - 1)];
};

const GameView: React.FC<GameViewProps> = ({ 
  score, 
  setScore, 
  level, 
  setLevel,
  currentWeapon,
  isGameOver, 
  onGameOver 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputs, setInputs] = useState({ left: false, right: false });
  const [isShaking, setIsShaking] = useState(false);
  const [levelUpText, setLevelUpText] = useState("");
  const requestRef = useRef<number>(null);
  
  const gameEndedRef = useRef(false);

  // Estado interno mutável para performance máxima
  const stateRef = useRef({
    player: { 
      x: 162, y: 480, w: 36, h: 36, 
      vx: 0, accel: 1.8, friction: 0.88, maxSpeed: 12
    },
    obstacles: [] as Obstacle[],
    projectiles: [] as Projectile[],
    particles: [] as Particle[],
    frames: 0,
    score: score,
    level: level,
    spawnRate: 120, // Mais lento no início
    baseSpeed: 1.1, // Velocidade inicial bem mais baixa
    gridOffset: 0,
    width: 360,
    height: 640,
    warpActive: 0,
    currentTheme: getSectorTheme(level)
  });

  // CRITICAL: Este efeito só reseta o jogo quando isGameOver muda para falso (Novo Jogo)
  // Removido 'level' das dependências para evitar "cortes" durante a progressão normal
  useEffect(() => {
    if (!isGameOver) {
      gameEndedRef.current = false;
      const initialScore = (level - 1) * 100;
      
      stateRef.current = {
        ...stateRef.current,
        player: { 
          x: 162, y: 480, w: 36, h: 36, 
          vx: 0, accel: 1.8, friction: 0.88, maxSpeed: 12
        },
        obstacles: [],
        projectiles: [],
        particles: [],
        frames: 0,
        score: initialScore,
        level: level,
        spawnRate: Math.max(12, 120 - (level * 8)),
        baseSpeed: 1.1 + (level * 0.4),
        gridOffset: 0,
        warpActive: 0,
        currentTheme: getSectorTheme(level)
      };
      setScore(initialScore);
    }
  }, [isGameOver]); 

  const update = useCallback(() => {
    const s = stateRef.current;
    if (isGameOver || gameEndedRef.current) return;

    if (s.warpActive > 0) s.warpActive--;

    // Movimentação
    if (inputs.left) s.player.vx -= s.player.accel;
    if (inputs.right) s.player.vx += s.player.accel;
    s.player.vx *= s.player.friction;
    if (Math.abs(s.player.vx) < 0.1) s.player.vx = 0;
    if (s.player.vx > s.player.maxSpeed) s.player.vx = s.player.maxSpeed;
    if (s.player.vx < -s.player.maxSpeed) s.player.vx = -s.player.maxSpeed;
    s.player.x += s.player.vx;

    if (s.player.x < 0) { s.player.x = 0; s.player.vx = 0; }
    if (s.player.x > s.width - s.player.w) { s.player.x = s.width - s.player.w; s.player.vx = 0; }

    // Velocidade do grid (Efeito de rastro/velocidade)
    const warpBoost = s.warpActive > 0 ? Math.sin((s.warpActive / 180) * Math.PI) * 10 : 0;
    const effectiveSpeed = s.baseSpeed + warpBoost;
    s.gridOffset = (s.gridOffset + effectiveSpeed) % 40;

    // Tiros (baseado na arma equipada)
    if (s.frames % currentWeapon.fireRate === 0) {
      const dmg = currentWeapon.damage;
      if (currentWeapon.type === 'single') {
        s.projectiles.push({ x: s.player.x + s.player.w/2 - 2, y: s.player.y, vx: 0, vy: -15, w: 4, h: 18, damage: dmg });
      } else if (currentWeapon.type === 'double') {
        s.projectiles.push({ x: s.player.x + 4, y: s.player.y, vx: 0, vy: -15, w: 4, h: 18, damage: dmg });
        s.projectiles.push({ x: s.player.x + s.player.w - 8, y: s.player.y, vx: 0, vy: -15, w: 4, h: 18, damage: dmg });
      } else if (currentWeapon.type === 'plasma') {
        s.projectiles.push({ x: s.player.x + s.player.w/2 - 10, y: s.player.y - 10, vx: 0, vy: -12, w: 20, h: 20, damage: dmg });
      }
    }

    // Spawn Dinâmico (Pausa no pico do warp)
    if (s.frames % s.spawnRate === 0 && s.warpActive < 60) {
      const size = 26 + Math.random() * 24;
      s.obstacles.push({
        x: Math.random() * (s.width - size),
        y: -size,
        size,
        speed: s.baseSpeed + (Math.random() * 0.3),
        health: Math.floor(s.level / 2.5) + 1
      });
    }

    // Progressão Sem Cortes (Atingiu score 100, 200, 300...)
    const targetLevel = Math.min(10, Math.floor(s.score / 100) + 1);
    if (targetLevel > s.level) {
      s.level = targetLevel;
      s.currentTheme = getSectorTheme(s.level);
      
      // Notifica o componente pai APENAS para atualizar o HUD/MaxCheckpoint
      // Não resetamos nada no stateRef.current para manter a fluidez total
      setLevel(targetLevel);
      
      s.warpActive = 180; // 3 segundos de transição lenta e suave
      setLevelUpText(`${s.currentTheme.name} SECTOR`);
      setTimeout(() => setLevelUpText(""), 4000);
      
      s.spawnRate = Math.max(10, 120 - (s.level * 8));
      s.baseSpeed += 0.35;
      
      if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
    }

    // Colisões e Partículas
    for (let i = s.projectiles.length - 1; i >= 0; i--) {
      const p = s.projectiles[i];
      p.y += p.vy;
      for (let j = s.obstacles.length - 1; j >= 0; j--) {
        const o = s.obstacles[j];
        if (p.x < o.x + o.size && p.x + p.w > o.x && p.y < o.y + o.size && p.y + p.h > o.y) {
          o.health -= p.damage;
          s.projectiles.splice(i, 1);
          if (o.health <= 0) {
            for(let k=0; k<8; k++) s.particles.push({
                x: o.x + o.size/2, y: o.y + o.size/2, size: 2, vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12, alpha: 1, color: s.currentTheme.enemy
            });
            s.obstacles.splice(j, 1);
            s.score += 5;
            setScore(s.score);
          }
          break;
        }
      }
      if (p.y < -50) s.projectiles.splice(i, 1);
    }

    for (let i = s.obstacles.length - 1; i >= 0; i--) {
      const o = s.obstacles[i];
      o.y += o.speed + (s.warpActive > 0 ? 5 : 0);

      if (s.player.x < o.x + o.size - 8 && s.player.x + s.player.w > o.x + 8 && 
          s.player.y < o.y + o.size - 8 && s.player.y + s.player.h > o.y + 8) {
        gameEndedRef.current = true;
        setIsShaking(true);
        onGameOver(s.score);
        setTimeout(() => setIsShaking(false), 300);
      }

      if (o.y > s.height) {
        s.obstacles.splice(i, 1);
        s.score += 1;
        setScore(s.score);
      }
    }

    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) s.particles.splice(i, 1);
    }

    s.frames++;
  }, [inputs, currentWeapon, onGameOver, setLevel, setScore, isGameOver]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;
    const theme = s.currentTheme;
    
    // Suavização do fundo e rastro
    ctx.fillStyle = s.warpActive > 0 ? 'rgba(3, 3, 3, 0.2)' : '#030303';
    ctx.fillRect(0, 0, s.width, s.height);

    // Grid (Movimento constante)
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = s.warpActive > 0 ? 2 : 1;
    for(let i=0; i<=s.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s.height); ctx.stroke();
    }
    for(let i=-40; i<=s.height + 40; i+=40) {
        const y = i + s.gridOffset;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s.width, y); ctx.stroke();
    }

    // Player
    if (!gameEndedRef.current) {
      ctx.shadowBlur = s.warpActive > 0 ? 30 : 15;
      ctx.shadowColor = COLORS.primary;
      ctx.fillStyle = COLORS.primary;
      ctx.fillRect(s.player.x, s.player.y, s.player.w, s.player.h);
      ctx.fillStyle = COLORS.secondary;
      ctx.fillRect(s.player.x + 10, s.player.y - 4, s.player.w - 20, 4);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.fillRect(s.player.x + 12, s.player.y + 12, 12, 12);
    }

    // Elementos do jogo
    s.projectiles.forEach(p => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = COLORS.secondary;
        ctx.fillStyle = p.w > 10 ? COLORS.warning : COLORS.secondary;
        ctx.fillRect(p.x, p.y, p.w, p.h);
    });

    s.obstacles.forEach(o => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = theme.enemy;
      ctx.fillStyle = theme.enemy;
      ctx.fillRect(o.x, o.y, o.size, o.size);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(o.x + 2, o.y + 2, o.size - 4, o.size - 4);
      if (o.health > 1) {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 10px Orbitron";
          ctx.textAlign = "center";
          ctx.fillText(o.health.toString(), o.x + o.size/2, o.y + o.size/2 + 4);
      }
    });

    s.particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
    <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden bg-black">
      <div className="absolute top-0 w-full flex justify-between p-6 z-20 mt-safe pointer-events-none">
        <div className="bg-black/40 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
            <span className="text-[9px] text-gray-500 font-bold uppercase block">Sector</span>
            <span className="text-3xl font-orbitron font-black text-white">{level}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5 backdrop-blur-sm text-right">
            <span className="text-[9px] text-gray-500 font-bold uppercase block">Credits</span>
            <span className="text-3xl font-orbitron font-black text-[#00ff88]">{score}</span>
        </div>
      </div>

      {levelUpText && (
          <div className="absolute top-1/2 -translate-y-1/2 z-50 text-center pointer-events-none w-full animate-pulse">
              <h2 className="text-4xl font-orbitron font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] tracking-[0.2em] uppercase">
                  {levelUpText}
              </h2>
          </div>
      )}

      <div className={`relative w-full max-w-[400px] aspect-[9/16] transition-transform duration-700 ${isShaking ? 'animate-shake' : ''} ${stateRef.current.warpActive > 0 ? 'scale-[1.05] blur-[0.5px]' : 'scale-100'}`}>
          <canvas ref={canvasRef} width={360} height={640} className="w-full h-full border-x border-white/5 shadow-2xl" />
          <div className={`absolute inset-y-0 left-0 w-1 transition-all duration-200 ${inputs.left ? 'bg-[#00ff88] opacity-60' : 'opacity-0'}`} />
          <div className={`absolute inset-y-0 right-0 w-1 transition-all duration-200 ${inputs.right ? 'bg-[#00ff88] opacity-60' : 'opacity-0'}`} />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 flex z-30 mb-safe pointer-events-none">
        <div 
          onPointerDown={(e) => { e.preventDefault(); setInputs(p => ({ ...p, left: true })); }}
          onPointerUp={() => setInputs(p => ({ ...p, left: false }))}
          onPointerLeave={() => setInputs(p => ({ ...p, left: false }))}
          className="flex-1 pointer-events-auto flex items-end justify-start p-6 group"
        >
             <div className="h-24 w-1 bg-white/10 rounded-full transition-all group-active:h-48 group-active:bg-[#00ff88] group-active:shadow-[0_0_20px_#00ff88]" />
        </div>
        <div 
          onPointerDown={(e) => { e.preventDefault(); setInputs(p => ({ ...p, right: true })); }}
          onPointerUp={() => setInputs(p => ({ ...p, right: false }))}
          onPointerLeave={() => setInputs(p => ({ ...p, right: false }))}
          className="flex-1 pointer-events-auto flex items-end justify-end p-6 group"
        >
             <div className="h-24 w-1 bg-white/10 rounded-full transition-all group-active:h-48 group-active:bg-[#00ff88] group-active:shadow-[0_0_20px_#00ff88]" />
        </div>
      </div>

      <style>{`
        .mt-safe { margin-top: env(safe-area-inset-top); }
        .mb-safe { margin-bottom: env(safe-area-inset-bottom); }
        @keyframes shake {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-3px, 3px); }
          50% { transform: translate(3px, -3px); }
          75% { transform: translate(-3px, -3px); }
        }
        .animate-shake { animation: shake 0.1s infinite; }
      `}</style>
    </div>
  );
};

export default GameView;
