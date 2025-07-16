import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Character } from '../types/game';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

interface CharacterCreationProps {
  onCharacterCreated: (character: Character) => void;
  onBack: () => void;
}

export function CharacterCreation({ onCharacterCreated, onBack }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [race, setRace] = useState<Character['race']>('human');
  const [characterClass, setCharacterClass] = useState<Character['class']>('warrior');
  const [appearance, setAppearance] = useState({
    gender: 'male' as 'male' | 'female',
    hairStyle: 1,
    hairColor: '#8B4513',
    skinColor: '#FDBCB4',
    eyeColor: '#4A90E2',
    faceType: 1,
    bodyType: 'normal' as 'slim' | 'normal' | 'muscular',
    facialHair: 0,
    scars: false,
    tattoos: false
  });

  const races = [
    { 
      id: 'human', 
      name: 'Human', 
      description: 'Versatile and adaptable warriors',
      faction: 'Alliance',
      bonuses: '+2 Strength, +1 Stamina',
      classes: ['warrior', 'mage', 'archer', 'rogue', 'paladin', 'priest']
    },
    { 
      id: 'elf', 
      name: 'High Elf', 
      description: 'Masters of magic and archery',
      faction: 'Alliance',
      bonuses: '+3 Intellect, +1 Agility',
      classes: ['mage', 'archer', 'priest', 'warlock']
    },
    { 
      id: 'nightelf', 
      name: 'Night Elf', 
      description: 'Ancient guardians of nature',
      faction: 'Alliance',
      bonuses: '+2 Agility, +2 Intellect',
      classes: ['archer', 'rogue', 'priest', 'hunter']
    },
    { 
      id: 'dwarf', 
      name: 'Dwarf', 
      description: 'Hardy mountain folk',
      faction: 'Alliance',
      bonuses: '+3 Stamina, +1 Strength',
      classes: ['warrior', 'paladin', 'priest', 'hunter']
    },
    { 
      id: 'gnome', 
      name: 'Gnome', 
      description: 'Ingenious tinkers and mages',
      faction: 'Alliance',
      bonuses: '+4 Intellect',
      classes: ['mage', 'warlock', 'rogue']
    },
    { 
      id: 'orc', 
      name: 'Orc', 
      description: 'Fierce and honorable warriors',
      faction: 'Horde',
      bonuses: '+3 Strength, +1 Stamina',
      classes: ['warrior', 'hunter', 'warlock', 'rogue']
    },
    { 
      id: 'troll', 
      name: 'Troll', 
      description: 'Mystical jungle dwellers',
      faction: 'Horde',
      bonuses: '+2 Agility, +2 Intellect',
      classes: ['hunter', 'mage', 'priest', 'rogue']
    },
    { 
      id: 'undead', 
      name: 'Undead', 
      description: 'Cursed but powerful beings',
      faction: 'Horde',
      bonuses: '+2 Intellect, +1 Stamina, Shadow Resistance',
      classes: ['mage', 'warlock', 'priest', 'rogue']
    }
  ];

  const classes = [
    { 
      id: 'warrior', 
      name: 'Warrior', 
      description: 'Master of melee combat and defense',
      primaryStat: 'Strength',
      role: 'Tank/DPS',
      difficulty: 'Easy'
    },
    { 
      id: 'paladin', 
      name: 'Paladin', 
      description: 'Holy warrior with healing abilities',
      primaryStat: 'Strength',
      role: 'Tank/Healer',
      difficulty: 'Medium'
    },
    { 
      id: 'mage', 
      name: 'Mage', 
      description: 'Master of arcane magic',
      primaryStat: 'Intellect',
      role: 'DPS',
      difficulty: 'Hard'
    },
    { 
      id: 'warlock', 
      name: 'Warlock', 
      description: 'Dark magic and demon summoning',
      primaryStat: 'Intellect',
      role: 'DPS',
      difficulty: 'Hard'
    },
    { 
      id: 'priest', 
      name: 'Priest', 
      description: 'Divine healer and support',
      primaryStat: 'Intellect',
      role: 'Healer',
      difficulty: 'Medium'
    },
    { 
      id: 'archer', 
      name: 'Archer', 
      description: 'Ranged combat specialist',
      primaryStat: 'Agility',
      role: 'DPS',
      difficulty: 'Medium'
    },
    { 
      id: 'hunter', 
      name: 'Hunter', 
      description: 'Beast master and tracker',
      primaryStat: 'Agility',
      role: 'DPS',
      difficulty: 'Easy'
    },
    { 
      id: 'rogue', 
      name: 'Rogue', 
      description: 'Stealthy assassin',
      primaryStat: 'Agility',
      role: 'DPS',
      difficulty: 'Hard'
    }
  ];

  const hairStyles = [
    'Bald', 'Short', 'Medium', 'Long', 'Braided', 'Ponytail', 'Mohawk', 'Curly'
  ];

  const faceTypes = [
    'Angular', 'Round', 'Square', 'Oval', 'Heart', 'Diamond'
  ];

  const facialHairStyles = [
    'None', 'Goatee', 'Full Beard', 'Mustache', 'Soul Patch', 'Sideburns'
  ];

  const selectedRace = races.find(r => r.id === race);
  const selectedClass = classes.find(c => c.id === characterClass);
  const availableClasses = classes.filter(c => selectedRace?.classes.includes(c.id));

  const getBaseStats = () => {
    const baseStats = { strength: 10, agility: 10, intellect: 10, stamina: 10 };
    
    // Race bonuses
    switch (race) {
      case 'human':
        baseStats.strength += 2;
        baseStats.stamina += 1;
        break;
      case 'elf':
        baseStats.intellect += 3;
        baseStats.agility += 1;
        break;
      case 'nightelf':
        baseStats.agility += 2;
        baseStats.intellect += 2;
        break;
      case 'dwarf':
        baseStats.stamina += 3;
        baseStats.strength += 1;
        break;
      case 'gnome':
        baseStats.intellect += 4;
        break;
      case 'orc':
        baseStats.strength += 3;
        baseStats.stamina += 1;
        break;
      case 'troll':
        baseStats.agility += 2;
        baseStats.intellect += 2;
        break;
      case 'undead':
        baseStats.intellect += 2;
        baseStats.stamina += 1;
        break;
    }

    return baseStats;
  };

  const randomizeAppearance = () => {
    setAppearance({
      gender: Math.random() > 0.5 ? 'male' : 'female',
      hairStyle: Math.floor(Math.random() * hairStyles.length) + 1,
      hairColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      skinColor: `hsl(${20 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`,
      eyeColor: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
      faceType: Math.floor(Math.random() * faceTypes.length) + 1,
      bodyType: ['slim', 'normal', 'muscular'][Math.floor(Math.random() * 3)] as 'slim' | 'normal' | 'muscular',
      facialHair: Math.floor(Math.random() * facialHairStyles.length),
      scars: Math.random() > 0.7,
      tattoos: Math.random() > 0.8
    });
  };

  const handleCreateCharacter = () => {
    if (!name.trim()) return;

    const stats = getBaseStats();
    const character: Character = {
      id: Date.now().toString(),
      name: name.trim(),
      race,
      class: characterClass,
      level: 1,
      health: 100 + (stats.stamina * 5),
      maxHealth: 100 + (stats.stamina * 5),
      mana: 50 + (stats.intellect * 3),
      maxMana: 50 + (stats.intellect * 3),
      x: 400,
      y: 300,
      appearance,
      stats
    };

    onCharacterCreated(character);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-accent mb-2 drop-shadow-lg">
            Character Creation
          </h1>
          <p className="text-foreground/80 font-inter text-lg">
            Forge your destiny in the Medieval Realms
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Character Preview - Left Column */}
          <div className="xl:col-span-1">
            <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="font-cinzel text-accent flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Character Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-gradient-to-b from-muted/20 to-muted/40 rounded-lg flex flex-col items-center justify-center border-2 border-accent/30 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20"></div>
                  </div>
                  
                  {/* Character Model */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Head */}
                    <div 
                      className="w-24 h-24 rounded-full border-4 border-accent/50 relative shadow-lg"
                      style={{ backgroundColor: appearance.skinColor }}
                    >
                      {/* Hair */}
                      <div 
                        className={`absolute -top-2 left-1/2 transform -translate-x-1/2 rounded-t-full ${
                          appearance.hairStyle === 1 ? 'w-20 h-6' :
                          appearance.hairStyle === 2 ? 'w-16 h-8' :
                          appearance.hairStyle === 3 ? 'w-18 h-10' :
                          'w-22 h-12'
                        }`}
                        style={{ backgroundColor: appearance.hairColor }}
                      ></div>
                      
                      {/* Eyes */}
                      <div className="flex justify-center mt-6 space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: appearance.eyeColor }}
                        ></div>
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: appearance.eyeColor }}
                        ></div>
                      </div>
                      
                      {/* Facial Hair */}
                      {appearance.facialHair > 0 && (
                        <div 
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-3 rounded-b-lg"
                          style={{ backgroundColor: appearance.hairColor }}
                        ></div>
                      )}
                      
                      {/* Scars */}
                      {appearance.scars && (
                        <div className="absolute top-4 right-2 w-1 h-6 bg-red-400/60 transform rotate-12"></div>
                      )}
                    </div>
                    
                    {/* Body */}
                    <div 
                      className={`mt-2 rounded-lg border-2 border-accent/30 ${
                        appearance.bodyType === 'slim' ? 'w-16 h-20' :
                        appearance.bodyType === 'muscular' ? 'w-20 h-24' :
                        'w-18 h-22'
                      }`}
                      style={{ backgroundColor: appearance.skinColor }}
                    >
                      {/* Tattoos */}
                      {appearance.tattoos && (
                        <div className="w-full h-full bg-gradient-to-b from-blue-600/20 to-purple-600/20 rounded-lg"></div>
                      )}
                    </div>
                    
                    {/* Character Info */}
                    <div className="text-center mt-4">
                      <h3 className="font-cinzel text-xl text-accent font-bold">
                        {name || 'Unnamed Hero'}
                      </h3>
                      <p className="text-foreground/70 capitalize font-medium">
                        {appearance.gender} {selectedRace?.name} {selectedClass?.name}
                      </p>
                      <div className="flex justify-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          Level 1
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Randomize Button */}
                  <Button
                    onClick={randomizeAppearance}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 border-accent/50 text-accent hover:bg-accent/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Stats Preview */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(getBaseStats()).map(([stat, value]) => (
                    <div key={stat} className="bg-muted/30 rounded p-2 text-center">
                      <div className="text-xs text-foreground/60 capitalize">{stat}</div>
                      <div className="text-lg font-bold text-accent">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Character Options - Right Columns */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-accent/30">
                <TabsTrigger value="basic" className="font-cinzel">Basic Info</TabsTrigger>
                <TabsTrigger value="appearance" className="font-cinzel">Appearance</TabsTrigger>
                <TabsTrigger value="advanced" className="font-cinzel">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                {/* Name */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Character Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your character's name"
                      className="bg-input/50 border-accent/30 text-foreground text-lg"
                      maxLength={20}
                    />
                  </CardContent>
                </Card>

                {/* Race Selection */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Choose Your Race</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {races.map((raceOption) => (
                        <button
                          key={raceOption.id}
                          onClick={() => {
                            setRace(raceOption.id as Character['race']);
                            // Reset class if not available for this race
                            if (!raceOption.classes.includes(characterClass)) {
                              setCharacterClass(raceOption.classes[0] as Character['class']);
                            }
                          }}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            race === raceOption.id
                              ? 'border-accent bg-accent/20 text-accent shadow-lg'
                              : 'border-accent/30 hover:border-accent/50 text-foreground/80 hover:bg-accent/5'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-cinzel font-bold text-lg">{raceOption.name}</div>
                            <Badge variant={raceOption.faction === 'Alliance' ? 'default' : 'destructive'} className="text-xs">
                              {raceOption.faction}
                            </Badge>
                          </div>
                          <div className="text-sm text-foreground/70 mb-2">{raceOption.description}</div>
                          <div className="text-xs text-accent font-medium">{raceOption.bonuses}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Class Selection */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Choose Your Class</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableClasses.map((classOption) => (
                        <button
                          key={classOption.id}
                          onClick={() => setCharacterClass(classOption.id as Character['class'])}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            characterClass === classOption.id
                              ? 'border-accent bg-accent/20 text-accent shadow-lg'
                              : 'border-accent/30 hover:border-accent/50 text-foreground/80 hover:bg-accent/5'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-cinzel font-bold text-lg">{classOption.name}</div>
                            <Badge variant="outline" className="text-xs">
                              {classOption.difficulty}
                            </Badge>
                          </div>
                          <div className="text-sm text-foreground/70 mb-2">{classOption.description}</div>
                          <div className="flex justify-between text-xs">
                            <span className="text-accent font-medium">Primary: {classOption.primaryStat}</span>
                            <span className="text-foreground/60">Role: {classOption.role}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4">
                {/* Gender */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Gender</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <Button
                        variant={appearance.gender === 'male' ? 'default' : 'outline'}
                        onClick={() => setAppearance(prev => ({ ...prev, gender: 'male' }))}
                        className="flex-1 font-cinzel"
                      >
                        Male
                      </Button>
                      <Button
                        variant={appearance.gender === 'female' ? 'default' : 'outline'}
                        onClick={() => setAppearance(prev => ({ ...prev, gender: 'female' }))}
                        className="flex-1 font-cinzel"
                      >
                        Female
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Features */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Physical Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Hair Style */}
                    <div>
                      <Label className="text-foreground/80 font-medium">Hair Style</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAppearance(prev => ({ 
                            ...prev, 
                            hairStyle: Math.max(1, prev.hairStyle - 1) 
                          }))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center font-medium">
                          {hairStyles[appearance.hairStyle - 1] || 'Style 1'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAppearance(prev => ({ 
                            ...prev, 
                            hairStyle: Math.min(hairStyles.length, prev.hairStyle + 1) 
                          }))}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Face Type */}
                    <div>
                      <Label className="text-foreground/80 font-medium">Face Type</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAppearance(prev => ({ 
                            ...prev, 
                            faceType: Math.max(1, prev.faceType - 1) 
                          }))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center font-medium">
                          {faceTypes[appearance.faceType - 1] || 'Type 1'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAppearance(prev => ({ 
                            ...prev, 
                            faceType: Math.min(faceTypes.length, prev.faceType + 1) 
                          }))}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Body Type */}
                    <div>
                      <Label className="text-foreground/80 font-medium">Body Type</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['slim', 'normal', 'muscular'].map((type) => (
                          <Button
                            key={type}
                            variant={appearance.bodyType === type ? 'default' : 'outline'}
                            onClick={() => setAppearance(prev => ({ ...prev, bodyType: type as 'slim' | 'normal' | 'muscular' }))}
                            className="capitalize"
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Facial Hair */}
                    {appearance.gender === 'male' && (
                      <div>
                        <Label className="text-foreground/80 font-medium">Facial Hair</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppearance(prev => ({ 
                              ...prev, 
                              facialHair: Math.max(0, prev.facialHair - 1) 
                            }))}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <div className="flex-1 text-center font-medium">
                            {facialHairStyles[appearance.facialHair] || 'None'}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppearance(prev => ({ 
                              ...prev, 
                              facialHair: Math.min(facialHairStyles.length - 1, prev.facialHair + 1) 
                            }))}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Colors */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-foreground/80 font-medium">Hair Color</Label>
                      <input
                        type="color"
                        value={appearance.hairColor}
                        onChange={(e) => setAppearance(prev => ({ ...prev, hairColor: e.target.value }))}
                        className="w-full h-12 rounded border-2 border-accent/30 mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground/80 font-medium">Skin Color</Label>
                      <input
                        type="color"
                        value={appearance.skinColor}
                        onChange={(e) => setAppearance(prev => ({ ...prev, skinColor: e.target.value }))}
                        className="w-full h-12 rounded border-2 border-accent/30 mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground/80 font-medium">Eye Color</Label>
                      <input
                        type="color"
                        value={appearance.eyeColor}
                        onChange={(e) => setAppearance(prev => ({ ...prev, eyeColor: e.target.value }))}
                        className="w-full h-12 rounded border-2 border-accent/30 mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4">
                {/* Special Features */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Special Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80 font-medium">Battle Scars</Label>
                      <Switch
                        checked={appearance.scars}
                        onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, scars: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground/80 font-medium">Tattoos</Label>
                      <Switch
                        checked={appearance.tattoos}
                        onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, tattoos: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Preview */}
                <Card className="bg-card/80 border-accent/40 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-accent">Starting Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(getBaseStats()).map(([stat, value]) => (
                        <div key={stat} className="bg-muted/30 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-foreground/80 capitalize font-medium">{stat}</span>
                            <span className="text-2xl font-bold text-accent">{value}</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
                            <div 
                              className="bg-accent h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(value / 20) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedRace && (
                      <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/30">
                        <h4 className="font-cinzel font-bold text-accent mb-2">Racial Bonuses</h4>
                        <p className="text-sm text-foreground/80">{selectedRace.bonuses}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="px-8 py-3 font-cinzel font-semibold border-2 border-accent/50 text-accent hover:bg-accent/10"
          >
            Back to Menu
          </Button>
          <Button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            size="lg"
            className="px-8 py-3 font-cinzel font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 shadow-lg"
          >
            Enter the Realm
          </Button>
        </div>
      </div>
    </div>
  );
}