
import React, { useEffect, useRef, useCallback } from 'react';
import { StampTextLine, Product } from '@/types';
import { sizePx, mmToPx } from '@/utils/dimensions';
import { layoutArc } from '@/engine/curvedText';
import { drawCurvedText } from '@/export/drawCurvedText';
import { clamp } from '@/utils/layout';

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

    const dpr = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
    const ctx = canvas.getContext('2d', { alpha: true }) as CanvasRenderingContext2D | null;
    if (!ctx) return;

    console.log('[ReactiveCanvas] Redrawing with:', {
      linesCount: lines.length,
      inkColor,
      shape,
      borderStyle,
      borderThickness,
      zoomLevel
    });

    // Set canvas dimensions based on product size (10 px per mm) and zoom with DPR scaling
    const { widthPx, heightPx } = sizePx(product?.size || '38x14mm');
    canvas.width = Math.max(1, Math.round(widthPx * zoomLevel * dpr));
    canvas.height = Math.max(1, Math.round(heightPx * zoomLevel * dpr));

    // Reset transform and apply DPR*zoom scaling; clear
    ctx.setTransform(dpr * zoomLevel, 0, 0, dpr * zoomLevel, 0, 0);
    ctx.clearRect(0, 0, widthPx, heightPx);

    // Scale-independent drawing from here in logical px
    ctx.save();

    const cx = widthPx / 2;
    const cy = heightPx / 2;

    // Safe-zone and border metrics
    const safe = mmToPx(1.0);
    const strokePxVal = Math.max(1, mmToPx(0.4));

    // Clip to exact stamp shape before drawing inner content (no margin)
    ctx.save();
    ctx.beginPath();
    drawBorderPath(ctx, widthPx, heightPx, shape, 0);
    ctx.clip();

    // Draw logo (clipped)
    if (includeLogo && logoImage) {
      drawLogo(ctx, logoImage, logoPosition, widthPx, heightPx);
    }

    // Draw text lines (straight and curved) inside clip
    drawTextLines(ctx, lines, inkColor, widthPx, heightPx, safe);

    // Restore after clip
    ctx.restore();

    // Draw border on top (no fill to keep transparent background)
    if (borderStyle !== 'none') {
      drawBorder(ctx, widthPx, heightPx, shape, borderStyle, borderThickness || strokePxVal, inkColor, mmToPx(1.0));
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

  const drawTextLines = (ctx: CanvasRenderingContext2D, textLines: StampTextLine[], color: string, width: number, height: number, safe: number) => {
    ctx.fillStyle = color;

    const measureWithSpacing = (k: CanvasRenderingContext2D, text: string, spacing: number) => {
      if (!text) return 0;
      if (spacing > 0) {
        const chars = text.split('');
        const sum = chars.reduce((acc, ch) => acc + k.measureText(ch).width, 0);
        return sum + (chars.length - 1) * spacing;
      }
      return k.measureText(text).width;
    };

    textLines.forEach((line) => {
      if (!line.text.trim() || line.visible === false) return;

      const fontPx = line.fontSizeMm ? mmToPx(line.fontSizeMm) : (line.fontSize || 16);
      const letterSpacingPx = line.letterSpacingMm ? mmToPx(line.letterSpacingMm) : (line.letterSpacing || 0);
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      const fontFamily = line.fontFamily || 'Arial';
      ctx.font = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;

      const fill = line.color || color;
      ctx.fillStyle = fill;

      // Check both legacy curved flag and new curve settings
      const isCurved = line.curved || (line.curve?.enabled && line.curve);
      
      if (isCurved) {
        // Curved rendering with axis clamp and rotation - add defensive defaults
        const productWidth = product ? sizePx(product.size).widthPx : 200;
        const productHeight = product ? sizePx(product.size).heightPx : 200;
        
        // Use new curve settings if available, fall back to legacy
        let cxRaw, cyRaw, radiusPx, arcDegrees, align, direction, rotationDeg;
        
        if (line.curve?.enabled && line.curve) {
          // New curve system
          cxRaw = line.axisXMm != null ? mmToPx(line.axisXMm) : width / 2;
          cyRaw = line.axisYMm != null ? mmToPx(line.axisYMm) : height / 2;
          radiusPx = mmToPx(line.curve.radiusMm || Math.min(productWidth, productHeight) / 4 / 10); // Convert to mm
          arcDegrees = line.curve.sweepDeg || 180;
          align = (line.curvedAlign || line.align || 'center') as any;
          direction = (line.curve.direction === 'inner' ? 'inside' : 'outside') as any;
          rotationDeg = (line.curve.startAngleDeg || -90) + (line.rotationDeg || 0);
        } else {
          // Legacy curved system
          cxRaw = line.axisXMm != null ? mmToPx(line.axisXMm) : width / 2;
          cyRaw = line.axisYMm != null ? mmToPx(line.axisYMm) : height / 2;
          radiusPx = Math.max(mmToPx(Math.max(0.1, line.radiusMm ?? Math.min(productWidth, productHeight) / 20)), 10);
          arcDegrees = line.arcDeg ?? 120;
          align = (line.curvedAlign || line.align || 'center') as any;
          direction = (line.direction || 'outside') as any;
          rotationDeg = line.rotationDeg || 0;
        }
        
        const cx = Math.min(width - safe, Math.max(safe, cxRaw));
        const cy = Math.min(height - safe, Math.max(safe, cyRaw));

        console.log('[ReactiveCanvas] Rendering curved text:', {
          text: line.text,
          cx, cy, radiusPx, arcDegrees, align, direction, rotationDeg,
          newCurveSystem: !!(line.curve?.enabled)
        });

        try {
          const poses = layoutArc({
            text: line.text,
            fontFamily,
            fontWeight,
            fontStyle,
            fontSizePx: fontPx,
            letterSpacingPx,
            radiusPx,
            arcDegrees,
            align,
            direction,
            centerX: cx,
            centerY: cy,
            rotationDeg,
          });

          if (poses && poses.length > 0) {
            drawCurvedText(ctx, poses, { font: ctx.font, fillStyle: fill });
          }
        } catch (error) {
          console.warn('[ReactiveCanvas] Error rendering curved text:', error);
          // Fallback to straight text if curved fails
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(line.text, cx, cy);
        }
        return;
      }

      // Straight rendering with clamped X/Y and alignment-aware bounds
      const alignMap = { left: 'left', center: 'center', right: 'right' } as const;
      const textAlign = alignMap[(line.alignment || 'center') as 'left' | 'center' | 'right'];
      ctx.textAlign = textAlign as CanvasTextAlign;
      const baseline = (line.baseline || 'middle') as CanvasTextBaseline;
      ctx.textBaseline = baseline;

      const totalW = measureWithSpacing(ctx, line.text, letterSpacingPx);
      const anchor = (line.alignment || 'center');
      const minX = safe + (anchor === 'right' ? totalW : 0);
      const maxX = (width - safe) - (anchor === 'left' ? totalW : 0);

      const x0 = line.xMm != null ? mmToPx(line.xMm) : width / 2;
      const y0 = line.yMm != null ? mmToPx(line.yMm) : height / 2;

      const x = Math.min(maxX, Math.max(minX, x0));
      const y = Math.min(height - safe, Math.max(safe, y0));

      if (letterSpacingPx > 0) {
        // Manual letter-spacing drawing
        const chars = line.text.split('');
        let currentX = x;
        if (anchor === 'center') currentX = x - totalW / 2;
        if (anchor === 'right') currentX = x - totalW;
        for (const ch of chars) {
          ctx.fillText(ch, currentX, y);
          currentX += ctx.measureText(ch).width + letterSpacingPx;
        }
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
