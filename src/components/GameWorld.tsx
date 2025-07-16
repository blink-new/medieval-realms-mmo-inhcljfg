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
  const [targetPosition, setTargetPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [movementPath, setMovementPath] = useState<Position[]>([]);
  const animationFrameRef = useRef<number>();

  // Game world dimensions
  const WORLD_WIDTH = 2000;
  const WORLD_HEIGHT = 1500;
  const TILE_SIZE = 32;

  const drawCharacter = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const bodySize = character.appearance.bodyType === 'slim' ? 14 : 
                     character.appearance.bodyType === 'muscular' ? 20 : 16;
    const headSize = character.appearance.bodyType === 'slim' ? 7 : 
                     character.appearance.bodyType === 'muscular' ? 9 : 8;

    // Character body
    ctx.fillStyle = character.appearance.skinColor;
    ctx.fillRect(x - bodySize/2, y - 16, bodySize, 20);

    // Character head
    ctx.beginPath();
    ctx.arc(x, y - 20, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Hair based on style
    ctx.fillStyle = character.appearance.hairColor;
    if (character.appearance.hairStyle > 1) {
      ctx.beginPath();
      const hairSize = headSize + 2;
      switch (character.appearance.hairStyle) {
        case 2: // Short
          ctx.arc(x, y - 24, hairSize, 0, Math.PI);
          break;
        case 3: // Medium
          ctx.arc(x, y - 26, hairSize + 1, 0, Math.PI);
          break;
        case 4: // Long
          ctx.arc(x, y - 28, hairSize + 2, 0, Math.PI);
          ctx.fillRect(x - hairSize, y - 20, hairSize * 2, 8);
          break;
        case 5: // Braided
          ctx.arc(x, y - 24, hairSize, 0, Math.PI);
          ctx.fillRect(x - 2, y - 15, 4, 10);
          break;
        case 6: // Ponytail
          ctx.arc(x, y - 24, hairSize, 0, Math.PI);
          ctx.fillRect(x + hairSize - 2, y - 20, 3, 12);
          break;
        case 7: // Mohawk
          ctx.fillRect(x - 2, y - 30, 4, 15);
          break;
        case 8: // Curly
          ctx.arc(x - 3, y - 26, 4, 0, Math.PI * 2);
          ctx.arc(x + 3, y - 26, 4, 0, Math.PI * 2);
          ctx.arc(x, y - 28, 4, 0, Math.PI * 2);
          break;
        default:
          ctx.arc(x, y - 24, hairSize, 0, Math.PI);
      }
      ctx.fill();
    }

    // Eyes
    ctx.fillStyle = character.appearance.eyeColor;
    ctx.fillRect(x - 3, y - 22, 2, 2);
    ctx.fillRect(x + 1, y - 22, 2, 2);

    // Facial hair for males
    if (character.appearance.gender === 'male' && character.appearance.facialHair > 0) {
      ctx.fillStyle = character.appearance.hairColor;
      switch (character.appearance.facialHair) {
        case 1: // Goatee
          ctx.fillRect(x - 2, y - 16, 4, 3);
          break;
        case 2: // Full Beard
          ctx.fillRect(x - 4, y - 18, 8, 6);
          break;
        case 3: // Mustache
          ctx.fillRect(x - 3, y - 19, 6, 2);
          break;
        case 4: // Soul Patch
          ctx.fillRect(x - 1, y - 15, 2, 2);
          break;
        case 5: // Sideburns
          ctx.fillRect(x - 6, y - 22, 2, 8);
          ctx.fillRect(x + 4, y - 22, 2, 8);
          break;
      }
    }

    // Scars
    if (character.appearance.scars) {
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 2, y - 25);
      ctx.lineTo(x + 3, y - 18);
      ctx.stroke();
    }

    // Tattoos
    if (character.appearance.tattoos) {
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(x - bodySize/2 + 2, y - 14, 3, 8);
      ctx.fillRect(x + bodySize/2 - 5, y - 12, 3, 6);
    }

    // Equipment based on class
    switch (character.class) {
      case 'warrior':
        // Sword and Shield
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(x + 10, y - 25, 3, 20);
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 9, y - 8, 5, 8);
        // Shield
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(x - 12, y - 10, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'paladin':
        // Holy sword
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 10, y - 25, 3, 20);
        ctx.fillStyle = '#FFFFFF';
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
      case 'warlock':
        // Dark staff
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(x + 10, y - 30, 2, 25);
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(x + 11, y - 32, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'priest':
        // Holy staff
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(x + 10, y - 30, 2, 25);
        ctx.fillStyle = '#FFD700';
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
      case 'hunter':
        // Crossbow
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 8, y - 18, 8, 3);
        ctx.fillRect(x + 11, y - 20, 2, 8);
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

    // Level indicator
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Inter';
    ctx.fillText(`Lv.${character.level}`, x, y - 45);
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

      // Draw movement path
      if (movementPath.length > 0) {
        drawMovementPath(ctx, cameraX, cameraY);
      }

      // Draw movement target indicator
      if (isMoving) {
        drawMovementIndicator(ctx, targetPosition.x + cameraX, targetPosition.y + cameraY);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [character, mousePosition, isMoving, drawCharacter, movementPath, drawMovementPath, drawMovementIndicator, targetPosition]);

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

  const drawMovementIndicator = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.3 + 0.7;
    
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 3;
    ctx.globalAlpha = pulse;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    
    // Inner circle
    ctx.fillStyle = '#DAA520';
    ctx.globalAlpha = 0.3 * pulse;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }, []);

  const drawMovementPath = useCallback((ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) => {
    if (movementPath.length < 2) return;
    
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    
    const startPoint = movementPath[0];
    ctx.moveTo(startPoint.x + cameraX, startPoint.y + cameraY);
    
    for (let i = 1; i < movementPath.length; i++) {
      const point = movementPath[i];
      ctx.lineTo(point.x + cameraX, point.y + cameraY);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }, [movementPath]);

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
    const targetX = Math.max(32, Math.min(WORLD_WIDTH - 32, worldX));
    const targetY = Math.max(32, Math.min(WORLD_HEIGHT - 32, worldY));

    // Set target position and create movement path
    setTargetPosition({ x: targetX, y: targetY });
    setMovementPath([
      { x: character.x, y: character.y },
      { x: targetX, y: targetY }
    ]);
    setIsMoving(true);

    // Animate character movement with smooth easing
    const startX = character.x;
    const startY = character.y;
    const distance = Math.sqrt((targetX - startX) ** 2 + (targetY - startY) ** 2);
    const baseSpeed = 150; // pixels per second
    const duration = Math.max(300, (distance / baseSpeed) * 1000);
    const startTime = Date.now();

    const moveCharacter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentX = startX + (targetX - startX) * easeProgress;
      const currentY = startY + (targetY - startY) * easeProgress;

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
        setMovementPath([]);
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