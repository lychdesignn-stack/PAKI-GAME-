
import React, { useState } from 'react';
import { COLORS } from '../types';

interface MenuScreenProps {
  onStart: (level: number) => void;
  highScore: number;
  credits: number;
  maxCheckpoint: number;
  onOpenShop: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStart, highScore, credits, maxCheckpoint, onOpenShop }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Gera lista de todos os setores desbloqueados
  const availableLevels = [];
  for(let i=1; i <= Math.min(10, maxCheckpoint); i++) {
    availableLevels.push(i);
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-40 flex flex-col items-center justify-between p-8 text-center overflow-hidden">
      <div className="mt-12">
        <h1 className="text-8xl font-orbitron font-black text-[#00ff88] tracking-widest drop-shadow-[0_0_20px_#00ff88] mb-2">PAKI</h1>
        <p className="text-[#333] font-bold tracking-[0.5em] text-[10px]">SYSTEM CORE ACTIVATED</p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="text-left">
                <p className="text-[9px] text-gray-500 uppercase font-black">Account Balance</p>
                <p className="text-2xl font-orbitron font-bold text-white">${credits}</p>
            </div>
            <button 
                onClick={onOpenShop} 
                className="bg-[#00ccff] text-black font-black px-5 py-2.5 rounded-xl text-xs font-orbitron active:scale-90 transition-transform"
            >
                SHOP
            </button>
        </div>

        <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Select Sector</p>
                <p className="text-[9px] text-[#00ff88] font-bold uppercase">Authorized Access</p>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mask-fade-edges justify-start">
                {availableLevels.map(lvl => (
                    <button 
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                            selectedLevel === lvl 
                            ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]' 
                            : 'bg-white/5 border-white/10 text-white opacity-40 hover:opacity-100'
                        }`}
                    >
                        <span className="text-[8px] uppercase font-black">Sector</span>
                        <span className="text-xl font-orbitron font-black">{lvl}</span>
                    </button>
                ))}
            </div>
        </div>

        <button 
            onClick={() => onStart(selectedLevel)}
            className="w-full py-6 bg-[#00ff88] text-[#0a0a0c] font-black text-2xl rounded-2xl shadow-[0_0_40px_rgba(0,255,136,0.3)] active:scale-95 transition-all font-orbitron uppercase tracking-widest"
        >
            Launch Run
        </button>
      </div>

      <div className="mb-8 space-y-2 opacity-50">
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">High Score Data: {highScore}</p>
        <p className="text-gray-600 text-[8px] uppercase font-bold tracking-[0.1em]">Target: Reach Sector 10 for Mastery</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </div>
  );
};

export default MenuScreen;
