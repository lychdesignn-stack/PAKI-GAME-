
import React from 'react';
import { COLORS } from '../types';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ 
  score, 
  highScore, 
  onRestart, 
  onMenu 
}) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
      <h2 className="text-5xl font-orbitron font-black text-white mb-2 drop-shadow-[0_0_15px_#ff3366] animate-bounce">
        GAME OVER
      </h2>
      
      <div className="bg-[#1a1a2e] border-2 border-[#ff3366]/30 p-8 rounded-3xl w-full max-w-xs flex flex-col items-center shadow-2xl my-8">
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Pontuação Atual</p>
        <p className="text-6xl font-orbitron font-black text-[#00ff88] mb-6">{score}</p>
        
        <div className="w-full h-[1px] bg-gray-700 mb-6"></div>
        
        <p className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Melhor Marca</p>
        <p className="text-2xl font-orbitron font-bold text-white">{highScore}</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-[#00ff88] text-[#0a0a0c] font-black text-xl rounded-2xl shadow-[0_5px_15px_rgba(0,255,136,0.3)] active:scale-95 transition-transform font-orbitron uppercase"
        >
          Tentar de Novo
        </button>
        <button 
          onClick={onMenu}
          className="w-full py-4 bg-transparent border-2 border-gray-600 text-gray-400 font-bold text-lg rounded-2xl active:scale-95 transition-transform font-orbitron uppercase"
        >
          Menu Principal
        </button>
      </div>

      <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest animate-pulse">
        Toque para escolher uma opção
      </p>
    </div>
  );
};

export default GameOverOverlay;
