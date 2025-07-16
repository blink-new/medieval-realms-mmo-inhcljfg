export interface Character {
  id: string;
  name: string;
  race: 'human' | 'elf' | 'dwarf' | 'orc';
  class: 'warrior' | 'mage' | 'archer' | 'rogue';
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  x: number;
  y: number;
  appearance: {
    hairColor: string;
    skinColor: string;
    eyeColor: string;
  };
}

export interface GameState {
  currentCharacter: Character | null;
  isCharacterCreated: boolean;
  gameMode: 'menu' | 'character-creation' | 'game-world';
}

export interface Position {
  x: number;
  y: number;
}