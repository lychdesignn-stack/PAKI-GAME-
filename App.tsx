import React, { useState, useEffect } from 'react';
import { GameState, COLORS } from './types';
import LoadingScreen from './components/LoadingScreen';
import MenuScreen from './components/MenuScreen';
import GameView from './components/GameView';
import GameOverOverlay from './components/GameOverOverlay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('paki-highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('paki-highscore', score.toString());
      } catch (e) {
        console.warn("Storage restricted", e);
      }
    }
  }, [score, highScore]);

  const handleStartGame = () => {
    setScore(0);
    setLevel(1);
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.GAMEOVER);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center overflow-hidden font-inter select-none touch-none">
      {gameState === GameState.LOADING && (
        <LoadingScreen onComplete={() => setGameState(GameState.MENU)} />
      )}
      
      {gameState === GameState.MENU && (
        <MenuScreen onStart={handleStartGame} highScore={highScore} />
      )}

      {(gameState === GameState.PLAYING || gameState === GameState.GAMEOVER) && (
        <GameView 
          score={score} 
          setScore={setScore}
          level={level} 
          setLevel={setLevel}
          isGameOver={gameState === GameState.GAMEOVER}
          onGameOver={handleGameOver}
        />
      )}

      {gameState === GameState.GAMEOVER && (
        <GameOverOverlay 
          score={score} 
          highScore={highScore}
          onRestart={handleStartGame}
          onMenu={() => setGameState(GameState.MENU)}
        />
      )}
    </div>
  );
};

export default App;