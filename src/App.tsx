import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { CharacterCreation } from './components/CharacterCreation';
import { GameWorld } from './components/GameWorld';
import { GameState, Character } from './types/game';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentCharacter: null,
    isCharacterCreated: false,
    gameMode: 'menu'
  });

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: 'character-creation'
    }));
  };

  const handleCharacterCreated = (character: Character) => {
    setGameState({
      currentCharacter: character,
      isCharacterCreated: true,
      gameMode: 'game-world'
    });
  };

  const handleCharacterUpdate = (character: Character) => {
    setGameState(prev => ({
      ...prev,
      currentCharacter: character
    }));
  };

  const handleBackToMenu = () => {
    setGameState({
      currentCharacter: null,
      isCharacterCreated: false,
      gameMode: 'menu'
    });
  };

  const handleBackToMenuFromCreation = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: 'menu'
    }));
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {gameState.gameMode === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}
      
      {gameState.gameMode === 'character-creation' && (
        <CharacterCreation 
          onCharacterCreated={handleCharacterCreated}
          onBack={handleBackToMenuFromCreation}
        />
      )}
      
      {gameState.gameMode === 'game-world' && gameState.currentCharacter && (
        <GameWorld 
          character={gameState.currentCharacter}
          onCharacterUpdate={handleCharacterUpdate}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;