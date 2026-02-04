
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, COLORS, INITIAL_WEAPONS, Weapon } from './types';
import LoadingScreen from './components/LoadingScreen';
import MenuScreen from './components/MenuScreen';
import GameView from './components/GameView';
import GameOverOverlay from './components/GameOverOverlay';
import ShopScreen from './components/ShopScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem('paki-credits');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('paki-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [maxCheckpoint, setMaxCheckpoint] = useState(() => {
    const saved = localStorage.getItem('paki-checkpoint');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [weapons, setWeapons] = useState<Weapon[]>(() => {
    const saved = localStorage.getItem('paki-weapons');
    return saved ? JSON.parse(saved) : INITIAL_WEAPONS;
  });
  const [currentWeaponId, setCurrentWeaponId] = useState(() => {
    return localStorage.getItem('paki-current-weapon') || 'w1';
  });

  const currentWeapon = weapons.find(w => w.id === currentWeaponId) || weapons[0];

  useEffect(() => {
    localStorage.setItem('paki-credits', credits.toString());
    localStorage.setItem('paki-weapons', JSON.stringify(weapons));
    localStorage.setItem('paki-current-weapon', currentWeaponId);
    localStorage.setItem('paki-checkpoint', maxCheckpoint.toString());
  }, [credits, weapons, currentWeaponId, maxCheckpoint]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('paki-highscore', score.toString());
    }
  }, [score, highScore]);

  const handleStartGame = useCallback((startLevel: number = 1) => {
    const initialScore = (startLevel - 1) * 100;
    setScore(initialScore);
    setLevel(startLevel);
    setGameState(GameState.PLAYING);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setCredits(prev => prev + Math.floor(finalScore / 10));
    setScore(finalScore);
    setGameState(GameState.GAMEOVER);
  }, []);

  const handleLevelUp = useCallback((newLevel: number) => {
    setLevel(newLevel);
    setMaxCheckpoint(prev => Math.max(prev, newLevel));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center overflow-hidden font-inter select-none touch-none">
      {gameState === GameState.LOADING && (
        <LoadingScreen onComplete={() => setGameState(GameState.MENU)} />
      )}
      
      {gameState === GameState.MENU && (
        <MenuScreen 
          onStart={handleStartGame} 
          highScore={highScore} 
          credits={credits}
          maxCheckpoint={maxCheckpoint}
          onOpenShop={() => setGameState(GameState.SHOP)}
        />
      )}

      {gameState === GameState.SHOP && (
        <ShopScreen 
          credits={credits} 
          setCredits={setCredits} 
          weapons={weapons} 
          setWeapons={setWeapons}
          currentWeaponId={currentWeaponId}
          setCurrentWeaponId={setCurrentWeaponId}
          onClose={() => setGameState(GameState.MENU)}
        />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.GAMEOVER) && (
        <GameView 
          score={score} 
          setScore={setScore}
          level={level} 
          setLevel={handleLevelUp}
          currentWeapon={currentWeapon}
          isGameOver={gameState === GameState.GAMEOVER}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === GameState.GAMEOVER && (
        <GameOverOverlay 
          score={score} 
          highScore={highScore}
          onRestart={() => handleStartGame(1)}
          onMenu={() => setGameState(GameState.MENU)}
        />
      )}
    </div>
  );
};

export default App;
