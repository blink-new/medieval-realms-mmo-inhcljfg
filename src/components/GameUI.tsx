import { Character } from '../types/game';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface GameUIProps {
  character: Character;
  onBackToMenu: () => void;
}

export function GameUI({ character, onBackToMenu }: GameUIProps) {
  const healthPercentage = (character.health / character.maxHealth) * 100;
  const manaPercentage = (character.mana / character.maxMana) * 100;

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Character Info */}
        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full border-2 border-accent/50 flex items-center justify-center relative"
              style={{ backgroundColor: character.appearance.skinColor }}
            >
              <div 
                className="w-8 h-3 rounded-t-full"
                style={{ backgroundColor: character.appearance.hairColor }}
              ></div>
              {character.appearance.scars && (
                <div className="absolute top-1 right-1 w-1 h-4 bg-red-400/60 transform rotate-12"></div>
              )}
            </div>
            <div>
              <h3 className="font-cinzel font-semibold text-accent">{character.name}</h3>
              <p className="text-sm text-foreground/70 capitalize">
                Level {character.level} {character.appearance.gender} {character.race.replace('nightelf', 'night elf')} {character.class}
              </p>
              <div className="flex space-x-2 mt-1 text-xs">
                <span className="text-red-400">STR: {character.stats.strength}</span>
                <span className="text-green-400">AGI: {character.stats.agility}</span>
                <span className="text-blue-400">INT: {character.stats.intellect}</span>
                <span className="text-yellow-400">STA: {character.stats.stamina}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Button */}
        <Button
          onClick={onBackToMenu}
          variant="outline"
          className="bg-card/80 backdrop-blur-sm border-accent/30 text-accent hover:bg-accent/10"
        >
          Menu
        </Button>
      </div>

      {/* Health and Mana Bars */}
      <div className="absolute top-20 left-4 space-y-2 z-10">
        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-3 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-400 font-semibold">Health</span>
              <span className="text-foreground/80">{character.health}/{character.maxHealth}</span>
            </div>
            <Progress 
              value={healthPercentage} 
              className="h-2"
              style={{
                background: 'rgba(139, 69, 19, 0.3)'
              }}
            />
          </div>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-3 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-400 font-semibold">Mana</span>
              <span className="text-foreground/80">{character.mana}/{character.maxMana}</span>
            </div>
            <Progress 
              value={manaPercentage} 
              className="h-2"
              style={{
                background: 'rgba(139, 69, 19, 0.3)'
              }}
            />
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-3">
          <div className="flex space-x-2">
            {/* Action buttons based on class */}
            {character.class === 'warrior' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Sword Strike">⚔️</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Shield Block">🛡️</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Charge">💨</Button>
              </>
            )}
            
            {character.class === 'paladin' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Holy Strike">✨</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Divine Shield">🛡️</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Heal">💚</Button>
              </>
            )}
            
            {character.class === 'mage' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Fireball">🔥</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Ice Shard">❄️</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Lightning">⚡</Button>
              </>
            )}
            
            {character.class === 'warlock' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Shadow Bolt">🌑</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Summon Demon">👹</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Curse">💀</Button>
              </>
            )}
            
            {character.class === 'priest' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Holy Light">✨</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Greater Heal">💚</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Shield">🛡️</Button>
              </>
            )}
            
            {character.class === 'archer' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Arrow Shot">🏹</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Multi Shot">🎯</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Eagle Eye">👁️</Button>
              </>
            )}
            
            {character.class === 'hunter' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Beast Shot">🏹</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Animal Companion">🐺</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Track">👣</Button>
              </>
            )}
            
            {character.class === 'rogue' && (
              <>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Backstab">🗡️</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Stealth">👤</Button>
                <Button size="sm" className="w-12 h-12 bg-primary/80 hover:bg-primary text-primary-foreground" title="Poison">☠️</Button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-2">
          <div className="w-32 h-24 bg-muted/30 rounded relative">
            <div className="absolute inset-1 bg-gradient-to-br from-primary/20 to-primary/10 rounded">
              {/* Character dot on minimap */}
              <div 
                className="absolute w-2 h-2 bg-accent rounded-full"
                style={{
                  left: `${(character.x / 2000) * 100}%`,
                  top: `${(character.y / 1500) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            <div className="text-xs text-center text-foreground/60 mt-1">Map</div>
          </div>
        </Card>
      </div>

      {/* Chat/Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-card/80 backdrop-blur-sm border-accent/30 p-3 max-w-sm">
          <p className="text-sm text-foreground/80">
            <span className="text-accent font-semibold">Click</span> to move around the medieval city. 
            Explore the realm and discover its secrets!
          </p>
        </Card>
      </div>
    </>
  );
}