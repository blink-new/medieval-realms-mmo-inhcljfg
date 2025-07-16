export interface Character {
  id: string;
  name: string;
  race: 'human' | 'elf' | 'dwarf' | 'orc' | 'undead' | 'nightelf' | 'gnome' | 'troll';
  class: 'warrior' | 'mage' | 'archer' | 'rogue' | 'paladin' | 'priest' | 'warlock' | 'hunter';
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  x: number;
  y: number;
  appearance: {
    gender: 'male' | 'female';
    hairStyle: number;
    hairColor: string;
    skinColor: string;
    eyeColor: string;
    faceType: number;
    bodyType: 'slim' | 'normal' | 'muscular';
    facialHair: number;
    scars: boolean;
    tattoos: boolean;
  };
  stats: {
    strength: number;
    agility: number;
    intellect: number;
    stamina: number;
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