
import React, { useEffect, useRef, useCallback } from 'react';
import { StampTextLine, Product } from '@/types';

interface ReactiveStampCanvasProps {
  lines: StampTextLine[];
  inkColor: string;
  includeLogo: boolean;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  logoImage: string | null;
  shape: 'rectangle' | 'circle' | 'ellipse' | 'square';
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderThickness: number;
  product: Product | null;
  zoomLevel: number;
  onCanvasUpdate?: (imageData: string) => void;
  className?: string;
}

const ReactiveStampCanvas: React.FC<ReactiveStampCanvasProps> = ({
  lines,
  inkColor,
  includeLogo,
  logoPosition,
  logoImage,
  shape,
  borderStyle,
  borderThickness,
  product,
  zoomLevel,
  onCanvasUpdate,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('[ReactiveCanvas] Redrawing with:', {
      linesCount: lines.length,
      inkColor,
      shape,
      borderStyle,
      borderThickness,
      zoomLevel
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions based on product and zoom
    const baseWidth = 200;
    const baseHeight = shape === 'circle' ? 200 : shape === 'ellipse' ? 150 : 120;
    canvas.width = baseWidth * zoomLevel;
    canvas.height = baseHeight * zoomLevel;

    // Scale context
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);

    // Draw background
    ctx.fillStyle = '#ffffff';
    drawShape(ctx, baseWidth, baseHeight, shape);

    // Draw border
    if (borderStyle !== 'none') {
      drawBorder(ctx, baseWidth, baseHeight, shape, borderStyle, borderThickness, inkColor);
    }

    // Draw logo
    if (includeLogo && logoImage) {
      drawLogo(ctx, logoImage, logoPosition, baseWidth, baseHeight);
    }

    // Draw text lines
    drawTextLines(ctx, lines, inkColor, baseWidth, baseHeight);

    ctx.restore();

    // Notify parent component of canvas update
    if (onCanvasUpdate) {
      const imageData = canvas.toDataURL('image/png');
      onCanvasUpdate(imageData);
    }
  }, [lines, inkColor, includeLogo, logoPosition, logoImage, shape, borderStyle, borderThickness, zoomLevel, onCanvasUpdate]);

  // Reactive redraw using useEffect
  useEffect(() => {
    console.log('[ReactiveCanvas] Configuration changed, scheduling redraw');
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Schedule redraw on next frame for smooth updates
    animationFrameRef.current = requestAnimationFrame(redrawCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [redrawCanvas]);

  const drawShape = (ctx: CanvasRenderingContext2D, width: number, height: number, shapeType: string) => {
    ctx.beginPath();
    switch (shapeType) {
      case 'circle':
        ctx.arc(width/2, height/2, Math.min(width, height)/2 - 10, 0, 2 * Math.PI);
        break;
      case 'ellipse':
        ctx.ellipse(width/2, height/2, width/2 - 10, height/2 - 10, 0, 0, 2 * Math.PI);
        break;
      default: // rectangle, square
        ctx.rect(10, 10, width - 20, height - 20);
    }
    ctx.fill();
  };

  const drawBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, shapeType: string, style: string, thickness: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    // Set line dash pattern
    switch (style) {
      case 'dashed':
        ctx.setLineDash([5, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([2, 2]);
        break;
      case 'double':
        ctx.setLineDash([]);
        // Draw double border
        const innerThickness = Math.max(1, thickness / 3);
        ctx.lineWidth = innerThickness;
        
        // Outer border
        ctx.beginPath();
        drawBorderPath(ctx, width, height, shapeType, -8);
        ctx.stroke();
        
        // Inner border
        ctx.beginPath();
        drawBorderPath(ctx, width, height, shapeType, -12);
        ctx.stroke();
        return;
      default:
        ctx.setLineDash([]);
    }

    ctx.beginPath();
    drawBorderPath(ctx, width, height, shapeType, -10);
    ctx.stroke();
  };

  const drawBorderPath = (ctx: CanvasRenderingContext2D, width: number, height: number, shapeType: string, offset: number) => {
    switch (shapeType) {
      case 'circle':
        ctx.arc(width/2, height/2, Math.min(width, height)/2 + offset, 0, 2 * Math.PI);
        break;
      case 'ellipse':
        ctx.ellipse(width/2, height/2, width/2 + offset, height/2 + offset, 0, 0, 2 * Math.PI);
        break;
      default:
        ctx.rect(10 - offset, 10 - offset, width - 20 + (2 * offset), height - 20 + (2 * offset));
    }
  };

  const drawLogo = (ctx: CanvasRenderingContext2D, logoSrc: string, position: string, width: number, height: number) => {
    const img = new Image();
    img.onload = () => {
      const logoSize = 30;
      let x = width/2 - logoSize/2;
      let y = height/2 - logoSize/2;

      switch (position) {
        case 'top':
          y = 20;
          break;
        case 'bottom':
          y = height - logoSize - 20;
          break;
        case 'left':
          x = 20;
          break;
        case 'right':
          x = width - logoSize - 20;
          break;
      }

      ctx.drawImage(img, x, y, logoSize, logoSize);
    };
    img.src = logoSrc;
  };

  const drawTextLines = (ctx: CanvasRenderingContext2D, textLines: StampTextLine[], color: string, width: number, height: number) => {
    ctx.fillStyle = color;

    textLines.forEach((line, index) => {
      if (!line.text.trim()) return;

      // Set font properties
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${line.fontSize || 16}px ${line.fontFamily || 'Arial'}`;
      ctx.textAlign = (line.alignment || 'center') as CanvasTextAlign;

      // Calculate position
      let x = width / 2;
      if (line.alignment === 'left') x = 20;
      if (line.alignment === 'right') x = width - 20;

      const lineHeight = Math.max((line.fontSize || 16) + 5, 25);
      const totalTextHeight = textLines.filter(l => l.text.trim()).length * lineHeight;
      const startY = (height - totalTextHeight) / 2 + lineHeight;
      let y = startY + index * lineHeight;

      // Apply custom positioning
      x += line.xPosition || 0;
      y += line.yPosition || 0;

      // Draw text with letter spacing if needed
      if (line.letterSpacing && line.letterSpacing > 0) {
        drawTextWithLetterSpacing(ctx, line.text, x, y, line.letterSpacing, line.alignment || 'center');
      } else {
        ctx.fillText(line.text, x, y);
      }
    });
  };

  const drawTextWithLetterSpacing = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, alignment: string) => {
    const chars = text.split('');
    const totalWidth = chars.reduce((acc, char) => acc + ctx.measureText(char).width, 0) + (chars.length - 1) * spacing;
    
    let currentX = x;
    if (alignment === 'center') {
      currentX = x - totalWidth / 2;
    } else if (alignment === 'right') {
      currentX = x - totalWidth;
    }
    
    chars.forEach((char) => {
      ctx.fillText(char, currentX, y);
      currentX += ctx.measureText(char).width + spacing;
    });
  };

  return (
    <div className={`border rounded-lg p-4 bg-white shadow-sm ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded cursor-pointer max-w-full"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};

export default ReactiveStampCanvas;
