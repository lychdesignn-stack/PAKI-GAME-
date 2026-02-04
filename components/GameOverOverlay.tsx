
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
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-8 backdrop-blur-md">
      <h2 className="text-5xl font-orbitron font-black text-white mb-2 drop-shadow-[0_0_20px_#ff3366] animate-pulse">
        FIM DE JOGO
      </h2>
      
      <div className="bg-[#0a0a0c] border-2 border-[#00ff88]/20 p-8 rounded-3xl w-full max-w-xs flex flex-col items-center shadow-2xl my-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"></div>
        
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">SCORE TOTAL</p>
        <p className="text-7xl font-orbitron font-black text-[#00ff88] mb-6 drop-shadow-[0_0_10px_#00ff88]">{score}</p>
        
        <div className="flex justify-between w-full px-2 mb-4">
            <div className="text-center">
                <p className="text-gray-600 text-[8px] font-bold uppercase">Best</p>
                <p className="text-xl font-orbitron text-white">{highScore}</p>
            </div>
            <div className="text-center">
                <p className="text-gray-600 text-[8px] font-bold uppercase">Rank</p>
                <p className="text-xl font-orbitron text-[#00ccff]">{score > 500 ? "S" : score > 200 ? "A" : "B"}</p>
            </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={onRestart}
          className="w-full py-5 bg-[#00ff88] text-[#0a0a0c] font-black text-xl rounded-2xl shadow-[0_5px_20px_rgba(0,255,136,0.4)] active:scale-90 transition-transform font-orbitron uppercase"
        >
          REINICIAR
        </button>
        <button 
          onClick={onMenu}
          className="w-full py-4 bg-transparent border-2 border-gray-800 text-gray-500 font-bold text-sm rounded-2xl active:scale-95 transition-transform font-orbitron uppercase"
        >
          MENU
        </button>
      </div>

      <p className="mt-8 text-gray-700 text-[9px] uppercase tracking-[0.5em] font-bold animate-pulse">
        PAKI ENGINE V2.0 - MOBILE READY
      </p>
    </div>
  );
};

export default GameOverOverlay;
