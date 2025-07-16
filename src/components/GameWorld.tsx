import { useEffect, useRef, useState, useCallback } from 'react';
import { Character, Position } from '../types/game';
import { GameUI } from './GameUI';

interface GameWorldProps {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
  onBackToMenu: () => void;
}

export function GameWorld({ character, onCharacterUpdate, onBackToMenu }: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const animationFrameRef = useRef<number>();

  // Game world dimensions
  const WORLD_WIDTH = 2000;
  const WORLD_HEIGHT = 1500;
  const TILE_SIZE = 32;

  const drawCharacter = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Character body
    ctx.fillStyle = character.appearance.skinColor;
    ctx.fillRect(x - 8, y - 16, 16, 20);

    // Character head
    ctx.beginPath();
    ctx.arc(x, y - 20, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = character.appearance.hairColor;
    ctx.beginPath();
    ctx.arc(x, y - 24, 10, 0, Math.PI);
    ctx.fill();

    // Eyes
    ctx.fillStyle = character.appearance.eyeColor;
    ctx.fillRect(x - 3, y - 22, 2, 2);
    ctx.fillRect(x + 1, y - 22, 2, 2);

    // Equipment based on class
    switch (character.class) {
      case 'warrior':
        // Sword
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x + 10, y - 25, 3, 20);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 9, y - 8, 5, 8);
        break;
      case 'mage':
        // Staff
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 10, y - 30, 2, 25);
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(x + 11, y - 32, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'archer':
        // Bow
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + 12, y - 15, 8, -Math.PI/3, Math.PI/3, false);
        ctx.stroke();
        break;
      case 'rogue':
        // Daggers
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x + 8, y - 12, 1, 8);
        ctx.fillRect(x + 12, y - 12, 1, 8);
        break;
    }

    // Character name
    ctx.fillStyle = '#DAA520';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(character.name, x, y - 35);
  }, [character]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#2C1810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate camera offset to center on character
      const cameraX = canvas.width / 2 - character.x;
      const cameraY = canvas.height / 2 - character.y;

      // Draw ground tiles
      ctx.fillStyle = '#3A2818';
      for (let x = 0; x < WORLD_WIDTH; x += TILE_SIZE) {
        for (let y = 0; y < WORLD_HEIGHT; y += TILE_SIZE) {
          const tileX = x + cameraX;
          const tileY = y + cameraY;
          
          if (tileX > -TILE_SIZE && tileX < canvas.width && tileY > -TILE_SIZE && tileY < canvas.height) {
            ctx.fillRect(tileX, tileY, TILE_SIZE - 1, TILE_SIZE - 1);
          }
        }
      }

      // Draw city buildings
      drawBuildings(ctx, cameraX, cameraY, canvas);

      // Draw character
      drawCharacter(ctx, character.x + cameraX, character.y + cameraY);

      // Draw movement indicator
      if (isMoving) {
        drawMovementIndicator(ctx, mousePosition.x, mousePosition.y);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [character, mousePosition, isMoving, drawCharacter]);

  const drawBuildings = (ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, canvas: HTMLCanvasElement) => {
    // Simple building structures
    const buildings = [
      { x: 200, y: 150, width: 120, height: 100, color: '#8B4513' },
      { x: 400, y: 200, width: 150, height: 120, color: '#A0522D' },
      { x: 600, y: 100, width: 100, height: 80, color: '#8B4513' },
      { x: 800, y: 250, width: 180, height: 140, color: '#A0522D' },
      { x: 300, y: 400, width: 140, height: 110, color: '#8B4513' },
    ];

    buildings.forEach(building => {
      const buildingX = building.x + cameraX;
      const buildingY = building.y + cameraY;

      if (buildingX > -building.width && buildingX < canvas.width && 
          buildingY > -building.height && buildingY < canvas.height) {
        
        // Building body
        ctx.fillStyle = building.color;
        ctx.fillRect(buildingX, buildingY, building.width, building.height);

        // Building roof
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(buildingX - 10, buildingY);
        ctx.lineTo(buildingX + building.width / 2, buildingY - 30);
        ctx.lineTo(buildingX + building.width + 10, buildingY);
        ctx.closePath();
        ctx.fill();

        // Door
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(buildingX + building.width / 2 - 15, buildingY + building.height - 40, 30, 40);

        // Windows
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(buildingX + 20, buildingY + 20, 25, 25);
        ctx.fillRect(buildingX + building.width - 45, buildingY + 20, 25, 25);
      }
    });
  };

  const drawMovementIndicator = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert screen coordinates to world coordinates
    const cameraX = canvas.width / 2 - character.x;
    const cameraY = canvas.height / 2 - character.y;
    const worldX = clickX - cameraX;
    const worldY = clickY - cameraY;

    // Clamp to world bounds
    const targetX = Math.max(16, Math.min(WORLD_WIDTH - 16, worldX));
    const targetY = Math.max(16, Math.min(WORLD_HEIGHT - 16, worldY));

    setMousePosition({ x: clickX, y: clickY });
    setIsMoving(true);

    // Animate character movement
    const startX = character.x;
    const startY = character.y;
    const distance = Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2);
    const duration = Math.max(500, distance * 2); // Movement speed
    const startTime = Date.now();

    const moveCharacter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentX = startX + (targetX - startX) * progress;
      const currentY = startY + (targetY - startY) * progress;

      const updatedCharacter = {
        ...character,
        x: currentX,
        y: currentY
      };

      onCharacterUpdate(updatedCharacter);

      if (progress < 1) {
        requestAnimationFrame(moveCharacter);
      } else {
        setIsMoving(false);
      }
    };

    moveCharacter();
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMoving) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        className="absolute inset-0 cursor-crosshair"
      />
      
      <GameUI 
        character={character}
        onBackToMenu={onBackToMenu}
      />
    </div>
  );
}