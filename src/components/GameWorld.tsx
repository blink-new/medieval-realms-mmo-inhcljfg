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

      // Draw ground with varied medieval textures
      for (let x = 0; x < WORLD_WIDTH; x += TILE_SIZE) {
        for (let y = 0; y < WORLD_HEIGHT; y += TILE_SIZE) {
          const tileX = x + cameraX;
          const tileY = y + cameraY;
          
          if (tileX > -TILE_SIZE && tileX < canvas.width && tileY > -TILE_SIZE && tileY < canvas.height) {
            // Vary ground color based on position for more natural look
            const variation = (Math.sin(x * 0.01) + Math.cos(y * 0.01)) * 10;
            const baseColor = 58 + variation; // Base brown color with variation
            ctx.fillStyle = `hsl(30, 40%, ${Math.max(15, Math.min(25, baseColor))}%)`;
            ctx.fillRect(tileX, tileY, TILE_SIZE - 1, TILE_SIZE - 1);
            
            // Add some grass patches randomly
            if (Math.random() > 0.85) {
              ctx.fillStyle = '#2D5016';
              ctx.fillRect(tileX + Math.random() * 20, tileY + Math.random() * 20, 8, 8);
            }
            
            // Add small stones occasionally
            if (Math.random() > 0.92) {
              ctx.fillStyle = '#696969';
              ctx.beginPath();
              ctx.arc(tileX + Math.random() * TILE_SIZE, tileY + Math.random() * TILE_SIZE, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw medieval environment (buildings, trees, paths)
      drawEnvironment(ctx, cameraX, cameraY, canvas);

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
  }, [character, mousePosition, isMoving, drawCharacter, movementPath, drawMovementPath, drawMovementIndicator, targetPosition, drawEnvironment]);

  const drawEnvironment = useCallback((ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, canvas: HTMLCanvasElement) => {
    // Medieval city buildings with more detail
    const buildings = [
      // Main castle/keep in the center
      { x: 450, y: 300, width: 200, height: 180, type: 'castle', color: '#696969' },
      
      // Town buildings around the castle
      { x: 200, y: 150, width: 120, height: 100, type: 'house', color: '#8B4513' },
      { x: 350, y: 120, width: 80, height: 90, type: 'shop', color: '#A0522D' },
      { x: 600, y: 100, width: 100, height: 80, type: 'house', color: '#8B4513' },
      { x: 750, y: 180, width: 140, height: 110, type: 'tavern', color: '#654321' },
      { x: 150, y: 300, width: 90, height: 85, type: 'house', color: '#A0522D' },
      { x: 300, y: 550, width: 110, height: 95, type: 'blacksmith', color: '#2F2F2F' },
      { x: 700, y: 400, width: 130, height: 120, type: 'church', color: '#8B7355' },
      { x: 850, y: 350, width: 100, height: 90, type: 'house', color: '#8B4513' },
      { x: 100, y: 500, width: 85, height: 80, type: 'house', color: '#A0522D' },
      { x: 500, y: 600, width: 120, height: 100, type: 'market', color: '#DAA520' },
      { x: 800, y: 600, width: 95, height: 85, type: 'house', color: '#8B4513' },
    ];

    // Draw buildings
    buildings.forEach(building => {
      const buildingX = building.x + cameraX;
      const buildingY = building.y + cameraY;

      if (buildingX > -building.width && buildingX < canvas.width && 
          buildingY > -building.height && buildingY < canvas.height) {
        
        // Building body
        ctx.fillStyle = building.color;
        ctx.fillRect(buildingX, buildingY, building.width, building.height);

        // Building details based on type
        switch (building.type) {
          case 'castle':
            // Castle towers
            ctx.fillStyle = '#555555';
            ctx.fillRect(buildingX - 5, buildingY - 20, 30, 200);
            ctx.fillRect(buildingX + building.width - 25, buildingY - 20, 30, 200);
            ctx.fillRect(buildingX + building.width / 2 - 15, buildingY - 40, 30, 220);
            
            // Castle flags
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(buildingX + 10, buildingY - 35, 15, 10);
            ctx.fillRect(buildingX + building.width - 15, buildingY - 35, 15, 10);
            ctx.fillRect(buildingX + building.width / 2 - 7, buildingY - 55, 15, 10);
            
            // Castle gate
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(buildingX + building.width / 2 - 25, buildingY + building.height - 60, 50, 60);
            break;
            
          case 'church':
            // Church spire
            ctx.fillStyle = '#654321';
            ctx.fillRect(buildingX + building.width / 2 - 8, buildingY - 60, 16, 80);
            
            // Cross on top
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(buildingX + building.width / 2 - 2, buildingY - 70, 4, 20);
            ctx.fillRect(buildingX + building.width / 2 - 6, buildingY - 65, 12, 4);
            
            // Arched windows
            ctx.fillStyle = '#4169E1';
            ctx.beginPath();
            ctx.arc(buildingX + 30, buildingY + 40, 15, 0, Math.PI, true);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(buildingX + building.width - 30, buildingY + 40, 15, 0, Math.PI, true);
            ctx.fill();
            break;
            
          case 'blacksmith':
            // Chimney with smoke
            ctx.fillStyle = '#2F2F2F';
            ctx.fillRect(buildingX + building.width - 20, buildingY - 30, 15, 50);
            
            // Smoke
            ctx.fillStyle = '#808080';
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 5; i++) {
              ctx.beginPath();
              ctx.arc(buildingX + building.width - 12 + Math.sin(Date.now() * 0.001 + i) * 5, 
                     buildingY - 40 - i * 8, 3 + i, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
            
            // Anvil symbol
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(buildingX + 20, buildingY + 30, 25, 15);
            break;
            
          case 'tavern':
            // Tavern sign
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(buildingX + 10, buildingY - 15, 40, 25);
            ctx.fillStyle = '#FFD700';
            ctx.font = '12px serif';
            ctx.fillText('🍺', buildingX + 25, buildingY - 2);
            break;
            
          case 'market':
            // Market stalls
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(buildingX + 10, buildingY + building.height - 30, 30, 30);
            ctx.fillRect(buildingX + 50, buildingY + building.height - 30, 30, 30);
            ctx.fillRect(buildingX + 90, buildingY + building.height - 30, 30, 30);
            break;
        }

        // Standard roof for most buildings (except castle)
        if (building.type !== 'castle') {
          ctx.fillStyle = building.type === 'church' ? '#8B4513' : '#654321';
          ctx.beginPath();
          ctx.moveTo(buildingX - 10, buildingY);
          ctx.lineTo(buildingX + building.width / 2, buildingY - 30);
          ctx.lineTo(buildingX + building.width + 10, buildingY);
          ctx.closePath();
          ctx.fill();
        }

        // Standard door (except for special buildings)
        if (!['castle', 'church', 'blacksmith'].includes(building.type)) {
          ctx.fillStyle = '#4A4A4A';
          ctx.fillRect(buildingX + building.width / 2 - 15, buildingY + building.height - 40, 30, 40);
        }

        // Standard windows (except for church and castle)
        if (!['church', 'castle'].includes(building.type)) {
          ctx.fillStyle = building.type === 'blacksmith' ? '#FF4500' : '#FFD700';
          ctx.fillRect(buildingX + 20, buildingY + 20, 20, 20);
          if (building.width > 100) {
            ctx.fillRect(buildingX + building.width - 40, buildingY + 20, 20, 20);
          }
        }
      }
    });

    // Draw trees throughout the map
    const trees = [
      // Forest area to the north
      { x: 100, y: 50, size: 'large' }, { x: 150, y: 30, size: 'medium' }, { x: 200, y: 70, size: 'large' },
      { x: 250, y: 40, size: 'small' }, { x: 300, y: 20, size: 'medium' }, { x: 350, y: 60, size: 'large' },
      { x: 450, y: 30, size: 'medium' }, { x: 500, y: 50, size: 'large' }, { x: 550, y: 25, size: 'small' },
      { x: 600, y: 45, size: 'medium' }, { x: 700, y: 35, size: 'large' }, { x: 750, y: 55, size: 'medium' },
      { x: 800, y: 25, size: 'small' }, { x: 850, y: 40, size: 'large' }, { x: 900, y: 60, size: 'medium' },
      
      // Trees around the city
      { x: 50, y: 200, size: 'medium' }, { x: 80, y: 250, size: 'large' }, { x: 120, y: 400, size: 'medium' },
      { x: 900, y: 200, size: 'large' }, { x: 950, y: 300, size: 'medium' }, { x: 980, y: 450, size: 'small' },
      
      // Southern forest
      { x: 150, y: 700, size: 'large' }, { x: 200, y: 750, size: 'medium' }, { x: 300, y: 720, size: 'large' },
      { x: 400, y: 780, size: 'small' }, { x: 500, y: 750, size: 'medium' }, { x: 600, y: 700, size: 'large' },
      { x: 700, y: 770, size: 'medium' }, { x: 800, y: 720, size: 'large' }, { x: 850, y: 760, size: 'small' },
      
      // Scattered trees around buildings
      { x: 380, y: 200, size: 'small' }, { x: 520, y: 180, size: 'medium' }, { x: 680, y: 250, size: 'small' },
      { x: 250, y: 350, size: 'medium' }, { x: 750, y: 320, size: 'small' }, { x: 450, y: 520, size: 'medium' },
      { x: 650, y: 550, size: 'large' }, { x: 350, y: 480, size: 'small' }, { x: 180, y: 600, size: 'medium' },
    ];

    trees.forEach(tree => {
      const treeX = tree.x + cameraX;
      const treeY = tree.y + cameraY;
      
      if (treeX > -50 && treeX < canvas.width + 50 && treeY > -80 && treeY < canvas.height + 50) {
        drawTree(ctx, treeX, treeY, tree.size);
      }
    });

    // Draw paths/roads
    drawPaths(ctx, cameraX, cameraY, canvas);
    
    // Helper function to draw trees
    function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: 'small' | 'medium' | 'large') {
    const treeSize = size === 'small' ? 0.7 : size === 'large' ? 1.3 : 1;
    const trunkWidth = 8 * treeSize;
    const trunkHeight = 25 * treeSize;
    const crownRadius = 20 * treeSize;
    
    // Tree trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - trunkWidth/2, y - trunkHeight, trunkWidth, trunkHeight);
    
    // Tree crown (multiple circles for fuller look)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y - trunkHeight - 5, crownRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Additional crown layers for depth
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(x - crownRadius/3, y - trunkHeight, crownRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + crownRadius/3, y - trunkHeight, crownRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight on crown
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.arc(x - crownRadius/4, y - trunkHeight - crownRadius/2, crownRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    }

    // Helper function to draw paths
    function drawPaths(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, canvas: HTMLCanvasElement) {
    ctx.fillStyle = '#D2B48C';
    ctx.globalAlpha = 0.8;
    
    // Main road through the city (horizontal)
    const mainRoadY = 400 + cameraY;
    if (mainRoadY > -30 && mainRoadY < canvas.height + 30) {
      ctx.fillRect(0, mainRoadY, canvas.width, 30);
    }
    
    // Cross road (vertical)
    const crossRoadX = 500 + cameraX;
    if (crossRoadX > -30 && crossRoadX < canvas.width + 30) {
      ctx.fillRect(crossRoadX, 0, 30, canvas.height);
    }
    
    // Smaller paths to buildings
    const paths = [
      { x1: 200, y1: 400, x2: 200, y2: 250 }, // To northern houses
      { x1: 500, y1: 400, x2: 550, y2: 300 }, // To castle
      { x1: 500, y1: 430, x2: 700, y2: 520 }, // To church
      { x1: 470, y1: 400, x2: 300, y2: 550 }, // To blacksmith
    ];
    
    paths.forEach(path => {
      const x1 = path.x1 + cameraX;
      const y1 = path.y1 + cameraY;
      const x2 = path.x2 + cameraX;
      const y2 = path.y2 + cameraY;
      
      ctx.strokeStyle = '#D2B48C';
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    
    ctx.globalAlpha = 1;
    }
  }, []);

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