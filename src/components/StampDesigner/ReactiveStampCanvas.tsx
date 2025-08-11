
import React, { useEffect, useRef, useCallback } from 'react';
import { StampTextLine, Product } from '@/types';
import { sizePx, mmToPx } from '@/utils/dimensions';
import { layoutArc } from '@/engine/curvedText';
import { drawCurvedText } from '@/export/drawCurvedText';

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

    // Set canvas dimensions based on product size (10 px per mm) and zoom
    const { widthPx, heightPx } = sizePx(product?.size || '38x14mm');
    canvas.width = Math.max(1, Math.round(widthPx * zoomLevel));
    canvas.height = Math.max(1, Math.round(heightPx * zoomLevel));

    // Scale context
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);

    const cx = widthPx / 2;
    const cy = heightPx / 2;

    // Safe-zone and border metrics
    const margin = mmToPx(1.0);
    const strokePx = Math.max(1, mmToPx(0.4));

    // Clip to stamp shape before drawing inner content
    ctx.save();
    ctx.beginPath();
    drawBorderPath(ctx, widthPx, heightPx, shape, margin);
    ctx.clip();

    // Draw logo (clipped)
    if (includeLogo && logoImage) {
      drawLogo(ctx, logoImage, logoPosition, widthPx, heightPx);
    }

    // Draw text lines (straight and curved) inside clip
    drawTextLines(ctx, lines, inkColor, widthPx, heightPx);

    // Restore after clip
    ctx.restore();

    // Draw border on top (no fill to keep transparent background)
    if (borderStyle !== 'none') {
      drawBorder(ctx, widthPx, heightPx, shape, borderStyle, borderThickness || strokePx, inkColor, margin);
    }

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

  const drawShape = (ctx: CanvasRenderingContext2D, width: number, height: number, shapeType: string, margin: number) => {
    ctx.beginPath();
    switch (shapeType) {
      case 'circle':
        ctx.arc(width/2, height/2, Math.min(width, height)/2 - margin, 0, 2 * Math.PI);
        break;
      case 'ellipse':
        ctx.ellipse(width/2, height/2, width/2 - margin, height/2 - margin, 0, 0, 2 * Math.PI);
        break;
      default: // rectangle, square
        ctx.rect(margin, margin, width - 2*margin, height - 2*margin);
    }
    // No fill to keep transparency in preview
  };

  const drawBorder = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    shapeType: string,
    style: string,
    thickness: number,
    color: string,
    margin: number
  ) => {
    ctx.save();
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
        drawBorderPath(ctx, width, height, shapeType, margin);
        ctx.stroke();
        // Inner border
        ctx.beginPath();
        drawBorderPath(ctx, width, height, shapeType, margin + mmToPx(2));
        ctx.stroke();
        ctx.restore();
        return;
      default:
        ctx.setLineDash([]);
    }

    ctx.beginPath();
    drawBorderPath(ctx, width, height, shapeType, margin);
    ctx.stroke();
    ctx.restore();
  };

  const drawBorderPath = (ctx: CanvasRenderingContext2D, width: number, height: number, shapeType: string, margin: number) => {
    switch (shapeType) {
      case 'circle':
        ctx.arc(width/2, height/2, Math.min(width, height)/2 - margin, 0, 2 * Math.PI);
        break;
      case 'ellipse':
        ctx.ellipse(width/2, height/2, width/2 - margin, height/2 - margin, 0, 0, 2 * Math.PI);
        break;
      default:
        ctx.rect(margin, margin, width - 2*margin, height - 2*margin);
    }
  };

  const drawLogo = (ctx: CanvasRenderingContext2D, logoSrc: string, position: string, width: number, height: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = Math.min(width, height) * 0.2;
      let x = width/2 - size/2;
      let y = height/2 - size/2;

      switch (position) {
        case 'top':
          y = mmToPx(1.0);
          break;
        case 'bottom':
          y = height - size - mmToPx(1.0);
          break;
        case 'left':
          x = mmToPx(1.0);
          break;
        case 'right':
          x = width - size - mmToPx(1.0);
          break;
      }

      ctx.drawImage(img, x, y, size, size);
    };
    img.src = logoSrc;
  };

  const drawTextLines = (ctx: CanvasRenderingContext2D, textLines: StampTextLine[], color: string, width: number, height: number) => {
    ctx.fillStyle = color;

    const cx = width / 2;
    const cy = height / 2;

    textLines.forEach((line) => {
      if (!line.text.trim() || line.visible === false) return;

      // Resolve font size and spacing
      const fontPx = line.fontSizeMm ? mmToPx(line.fontSizeMm) : (line.fontSize || 16);
      const letterSpacingPx = line.letterSpacingMm ? mmToPx(line.letterSpacingMm) : (line.letterSpacing || 0);
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      const fontFamily = line.fontFamily || 'Arial';
      ctx.font = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;

      const fill = line.color || color;
      ctx.fillStyle = fill;

      if (line.curved) {
        // Use mm-based curved controls when provided
        const centerX = line.axisXMm != null ? mmToPx(line.axisXMm) : cx;
        const centerY = line.axisYMm != null ? mmToPx(line.axisYMm) : cy;
        const radiusPx = line.radiusMm != null ? Math.max(0, mmToPx(line.radiusMm)) : Math.min(width, height) * 0.35;
        const arcDegrees = line.arcDeg ?? 180;
        const align = (line.curvedAlign || 'center');
        const direction = line.direction || 'outside';
        const rotationDeg = line.rotationDeg || 0;

        const poses = layoutArc({
          text: line.text,
          centerX,
          centerY,
          radiusPx,
          arcDegrees,
          align,
          direction,
          letterSpacingPx,
          font: ctx.font,
          rotationDeg,
        });

        drawCurvedText(ctx, poses, { font: ctx.font, fillStyle: fill });
        return;
      }

      // Straight text
      const textAlign = (line.alignment || 'center') as CanvasTextAlign;
      ctx.textAlign = textAlign;
      const baseline = line.baseline || 'alphabetic';
      ctx.textBaseline = baseline as CanvasTextBaseline;

      // Base position
      let x = line.xMm != null ? mmToPx(line.xMm) : (width / 2 + ((line.xPosition || 0) / 100) * (width / 2));
      let y = line.yMm != null ? mmToPx(line.yMm) : (height / 2 + ((line.yPosition || 0) / 100) * (height / 2));

      if (letterSpacingPx > 0) {
        drawTextWithLetterSpacing(ctx, line.text, x, y, letterSpacingPx, line.alignment || 'center');
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
