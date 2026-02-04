
import React from 'react';
import { COLORS } from '../types';

interface MenuScreenProps {
  onStart: () => void;
  highScore: number;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStart, highScore }) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-40 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-8xl font-orbitron font-black text-[#00ff88] tracking-widest drop-shadow-[0_0_20px_rgba(0,255,136,0.6)] animate-pulse">
          PAKI
        </h1>
        <p className="text-[#444] font-bold text-sm tracking-widest -mt-2">MOBILE EDITION</p>
      </div>

      <div className="mb-12 space-y-2">
        <p className="text-gray-500 uppercase text-xs tracking-tighter">Recorde Pessoal</p>
        <p className="text-4xl font-orbitron font-bold text-white tracking-tighter">{highScore}</p>
      </div>

      <button 
        onClick={onStart}
        className="px-16 py-5 bg-[#00ff88] text-[#0a0a0c] font-black text-2xl rounded-full shadow-[0_10px_30px_rgba(0,255,136,0.3)] hover:scale-105 active:scale-95 transition-transform uppercase font-orbitron tracking-wider"
      >
        Jogar
      </button>

      <div className="mt-16 text-gray-600 text-[10px] max-w-xs leading-relaxed uppercase tracking-widest">
        Dodge the hazards. Survive the grid. <br/> Level up every 25 points.
      </div>
    </div>
  );
};

export default MenuScreen;
