
import React, { useState, useEffect } from 'react';
import { COLORS } from '../types';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 10) + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] z-50 flex flex-col items-center justify-center">
      <h2 className="text-[#333] text-xs font-bold tracking-[0.3em] mb-4 uppercase">
        A Carregar Sistemas...
      </h2>
      <div className="w-56 h-1 bg-[#1a1a1a] rounded-full overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
        <div 
          className="h-full transition-all duration-100 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: COLORS.primary,
            boxShadow: `0 0 15px ${COLORS.primary}`
          }}
        />
      </div>
      <div className="mt-4 text-[#444] text-[10px] font-mono">
        {progress}% ENCRYPTING DATA...
      </div>
    </div>
  );
};

export default LoadingScreen;
