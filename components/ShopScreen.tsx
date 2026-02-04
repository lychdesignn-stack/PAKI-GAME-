
import React from 'react';
import { Weapon, COLORS } from '../types';

interface ShopScreenProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  weapons: Weapon[];
  setWeapons: React.Dispatch<React.SetStateAction<Weapon[]>>;
  currentWeaponId: string;
  setCurrentWeaponId: (id: string) => void;
  onClose: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ 
  credits, setCredits, weapons, setWeapons, currentWeaponId, setCurrentWeaponId, onClose 
}) => {
  const handleBuy = (weapon: Weapon) => {
    if (credits >= weapon.price && !weapon.unlocked) {
      setCredits(prev => prev - weapon.price);
      setWeapons(prev => prev.map(w => w.id === weapon.id ? { ...w, unlocked: true } : w));
      if (navigator.vibrate) navigator.vibrate(50);
    } else if (weapon.unlocked) {
      setCurrentWeaponId(weapon.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col p-8 font-inter">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h2 className="text-3xl font-orbitron font-black text-white">SHOP</h2>
            <p className="text-[#00ccff] font-orbitron text-sm">Credits: ${credits}</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white font-black">X</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        {weapons.map(w => (
          <div 
            key={w.id} 
            onClick={() => handleBuy(w)}
            className={`p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                currentWeaponId === w.id ? 'border-[#00ff88] bg-[#00ff88]/5' : 
                w.unlocked ? 'border-white/20 bg-white/5' : 'border-white/5 bg-black'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
                <h3 className={`font-orbitron font-bold ${w.unlocked ? 'text-white' : 'text-gray-600'}`}>{w.name}</h3>
                {w.unlocked ? (
                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">Owned</span>
                ) : (
                    <span className="text-sm font-orbitron font-bold text-[#00ccff]">${w.price}</span>
                )}
            </div>
            <div className="flex gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                <span>Power: {w.damage}</span>
                <span>Rate: {w.fireRate}ms</span>
                <span>Type: {w.type}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-gray-700 text-[10px] font-black uppercase tracking-widest">Equip weapons to boost sector clearing</p>
    </div>
  );
};

export default ShopScreen;
