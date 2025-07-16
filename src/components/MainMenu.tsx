import { Button } from './ui/button';

interface MainMenuProps {
  onStartGame: () => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/70 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DAA520' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        {/* Title */}
        <h1 className="font-cinzel text-6xl md:text-8xl font-bold text-accent mb-4 drop-shadow-2xl">
          Medieval Realms
        </h1>
        
        {/* Subtitle */}
        <p className="font-cinzel text-xl md:text-2xl text-foreground/80 mb-12 tracking-wide">
          Enter a world of endless adventure
        </p>
        
        {/* Menu buttons */}
        <div className="space-y-4 max-w-sm mx-auto">
          <Button 
            onClick={onStartGame}
            className="w-full h-14 text-lg font-cinzel font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-accent/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Create Character
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-14 text-lg font-cinzel font-semibold border-2 border-accent/50 text-accent hover:bg-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Load Character
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-14 text-lg font-cinzel font-semibold border-2 border-accent/50 text-accent hover:bg-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Settings
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-14 text-lg font-cinzel font-semibold border-2 border-accent/50 text-accent hover:bg-accent/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Exit Game
          </Button>
        </div>
        
        {/* Version info */}
        <p className="text-muted-foreground text-sm mt-12 font-inter">
          Version 1.0.0 - Alpha Build
        </p>
      </div>
    </div>
  );
}