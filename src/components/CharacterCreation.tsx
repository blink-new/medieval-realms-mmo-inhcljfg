import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Character } from '../types/game';

interface CharacterCreationProps {
  onCharacterCreated: (character: Character) => void;
  onBack: () => void;
}

export function CharacterCreation({ onCharacterCreated, onBack }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Character['race']>('human');
  const [characterClass, setCharacterClass] = useState<Character['class']>('warrior');
  const [appearance, setAppearance] = useState({
    hairColor: '#8B4513',
    skinColor: '#FDBCB4',
    eyeColor: '#4A90E2'
  });

  const races = [
    { id: 'human', name: 'Human', description: 'Versatile and adaptable' },
    { id: 'elf', name: 'Elf', description: 'Graceful and magical' },
    { id: 'dwarf', name: 'Dwarf', description: 'Strong and resilient' },
    { id: 'orc', name: 'Orc', description: 'Fierce and powerful' }
  ];

  const classes = [
    { id: 'warrior', name: 'Warrior', description: 'Master of melee combat' },
    { id: 'mage', name: 'Mage', description: 'Wielder of arcane magic' },
    { id: 'archer', name: 'Archer', description: 'Expert marksman' },
    { id: 'rogue', name: 'Rogue', description: 'Stealthy and cunning' }
  ];

  const handleCreateCharacter = () => {
    if (!name.trim()) return;

    const character: Character = {
      id: Date.now().toString(),
      name: name.trim(),
      race,
      class: characterClass,
      level: 1,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      x: 400,
      y: 300,
      appearance
    };

    onCharacterCreated(character);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/70 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-accent mb-2">
            Create Your Character
          </h1>
          <p className="text-foreground/80 font-inter">
            Forge your legend in the Medieval Realms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Preview */}
          <Card className="bg-card/50 border-accent/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-accent">Character Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center border-2 border-accent/20">
                <div className="text-center">
                  <div 
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent/50"
                    style={{ backgroundColor: appearance.skinColor }}
                  >
                    <div 
                      className="w-full h-8 rounded-t-full mt-4"
                      style={{ backgroundColor: appearance.hairColor }}
                    ></div>
                    <div className="flex justify-center mt-4 space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: appearance.eyeColor }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: appearance.eyeColor }}
                      ></div>
                    </div>
                  </div>
                  <h3 className="font-cinzel text-xl text-accent">{name || 'Unnamed Hero'}</h3>
                  <p className="text-foreground/70 capitalize">{race} {characterClass}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Options */}
          <div className="space-y-6">
            {/* Name */}
            <Card className="bg-card/50 border-accent/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-accent">Character Name</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter character name"
                  className="bg-input/50 border-accent/30 text-foreground"
                  maxLength={20}
                />
              </CardContent>
            </Card>

            {/* Race Selection */}
            <Card className="bg-card/50 border-accent/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-accent">Race</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {races.map((raceOption) => (
                    <button
                      key={raceOption.id}
                      onClick={() => setRace(raceOption.id as Character['race'])}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        race === raceOption.id
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-accent/30 hover:border-accent/50 text-foreground/80'
                      }`}
                    >
                      <div className="font-cinzel font-semibold">{raceOption.name}</div>
                      <div className="text-sm text-foreground/60">{raceOption.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Class Selection */}
            <Card className="bg-card/50 border-accent/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-accent">Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {classes.map((classOption) => (
                    <button
                      key={classOption.id}
                      onClick={() => setCharacterClass(classOption.id as Character['class'])}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        characterClass === classOption.id
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-accent/30 hover:border-accent/50 text-foreground/80'
                      }`}
                    >
                      <div className="font-cinzel font-semibold">{classOption.name}</div>
                      <div className="text-sm text-foreground/60">{classOption.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="bg-card/50 border-accent/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-accent">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-foreground/80">Hair Color</Label>
                  <input
                    type="color"
                    value={appearance.hairColor}
                    onChange={(e) => setAppearance(prev => ({ ...prev, hairColor: e.target.value }))}
                    className="w-full h-10 rounded border-2 border-accent/30"
                  />
                </div>
                <div>
                  <Label className="text-foreground/80">Skin Color</Label>
                  <input
                    type="color"
                    value={appearance.skinColor}
                    onChange={(e) => setAppearance(prev => ({ ...prev, skinColor: e.target.value }))}
                    className="w-full h-10 rounded border-2 border-accent/30"
                  />
                </div>
                <div>
                  <Label className="text-foreground/80">Eye Color</Label>
                  <input
                    type="color"
                    value={appearance.eyeColor}
                    onChange={(e) => setAppearance(prev => ({ ...prev, eyeColor: e.target.value }))}
                    className="w-full h-10 rounded border-2 border-accent/30"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8 py-3 font-cinzel font-semibold border-2 border-accent/50 text-accent hover:bg-accent/10"
          >
            Back to Menu
          </Button>
          <Button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            className="px-8 py-3 font-cinzel font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            Enter the Realm
          </Button>
        </div>
      </div>
    </div>
  );
}