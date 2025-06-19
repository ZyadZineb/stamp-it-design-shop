
import React, { useEffect, useRef, useState } from 'react';
import { StampTextLine, Product } from '@/types';

interface StampPreviewEnhancedProps {
  lines: StampTextLine[];
  inkColor: string;
  includeLogo: boolean;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  logoImage: string | null;
  shape: 'rectangle' | 'circle' | 'oval';
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderThickness: number;
  product: Product | null;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onTextDrag: (index: number) => void;
  onLogoDrag: () => void;
  onDrag: (e: any, rect: DOMRect) => void;
  onStopDragging: () => void;
  showControls?: boolean;
}

const StampPreviewEnhanced: React.FC<StampPreviewEnhancedProps> = ({
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
  onZoomIn,
  onZoomOut,
  onTextDrag,
  onLogoDrag,
  onDrag,
  onStopDragging,
  showControls = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasKey, setCanvasKey] = useState(0);

  // CRITICAL: Force re-render and redraw whenever any prop changes for live preview
  useEffect(() => {
    console.log('[StampPreview] Props changed, re-rendering canvas');
    setCanvasKey(prev => prev + 1);
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      redrawCanvas();
    });
  }, [lines, inkColor, includeLogo, logoPosition, logoImage, shape, borderStyle, borderThickness, zoomLevel]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('[StampPreview] Canvas ref not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('[StampPreview] Canvas context not available');
      return;
    }

    console.log('[StampPreview] Redrawing canvas with:', { 
      linesCount: lines.length, 
      inkColor, 
      shape, 
      borderStyle,
      borderThickness 
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size based on product and shape
    const baseWidth = 200;
    const baseHeight = shape === 'circle' ? 200 : shape === 'oval' ? 150 : 120;
    canvas.width = baseWidth * zoomLevel;
    canvas.height = baseHeight * zoomLevel;

    // Scale context for zoom
    ctx.scale(zoomLevel, zoomLevel);

    // Draw background
    ctx.fillStyle = '#ffffff';
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(baseWidth/2, baseHeight/2, Math.min(baseWidth, baseHeight)/2 - 10, 0, 2 * Math.PI);
      ctx.fill();
    } else if (shape === 'oval') {
      ctx.beginPath();
      ctx.ellipse(baseWidth/2, baseHeight/2, baseWidth/2 - 10, baseHeight/2 - 10, 0, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(10, 10, baseWidth - 20, baseHeight - 20);
    }

    // Draw border
    if (borderStyle !== 'none') {
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = borderThickness;
      
      if (borderStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (borderStyle === 'dotted') {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }

      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(baseWidth/2, baseHeight/2, Math.min(baseWidth, baseHeight)/2 - 10, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape === 'oval') {
        ctx.beginPath();
        ctx.ellipse(baseWidth/2, baseHeight/2, baseWidth/2 - 10, baseHeight/2 - 10, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        ctx.strokeRect(10, 10, baseWidth - 20, baseHeight - 20);
      }
    }

    // Draw logo if included
    if (includeLogo && logoImage) {
      const img = new Image();
      img.onload = () => {
        const logoSize = 30;
        let logoX = baseWidth/2 - logoSize/2;
        let logoY = baseHeight/2 - logoSize/2;

        switch (logoPosition) {
          case 'top':
            logoY = 20;
            break;
          case 'bottom':
            logoY = baseHeight - logoSize - 20;
            break;
          case 'left':
            logoX = 20;
            break;
          case 'right':
            logoX = baseWidth - logoSize - 20;
            break;
        }

        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      };
      img.src = logoImage;
    }

    // Draw text lines with proper formatting
    lines.forEach((line, index) => {
      if (!line.text.trim()) return;

      ctx.fillStyle = inkColor;
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${line.fontSize}px ${line.fontFamily}`;
      ctx.textAlign = line.alignment as CanvasTextAlign;

      let x = baseWidth / 2;
      if (line.alignment === 'left') x = 20;
      if (line.alignment === 'right') x = baseWidth - 20;

      const lineHeight = Math.max(line.fontSize + 5, 25);
      const totalTextHeight = lines.filter(l => l.text.trim()).length * lineHeight;
      const startY = (baseHeight - totalTextHeight) / 2 + lineHeight;
      let y = startY + index * lineHeight;

      // Apply custom positioning if set
      if (line.xPosition !== 0 || line.yPosition !== 0) {
        x += line.xPosition;
        y += line.yPosition;
      }

      // Apply letter spacing if specified
      if (line.letterSpacing && line.letterSpacing > 0) {
        // Manual letter spacing implementation
        const chars = line.text.split('');
        let currentX = x;
        if (line.alignment === 'center') {
          const totalWidth = chars.reduce((acc, char) => acc + ctx.measureText(char).width, 0) + (chars.length - 1) * line.letterSpacing;
          currentX = x - totalWidth / 2;
        } else if (line.alignment === 'right') {
          const totalWidth = chars.reduce((acc, char) => acc + ctx.measureText(char).width, 0) + (chars.length - 1) * line.letterSpacing;
          currentX = x - totalWidth;
        }
        
        chars.forEach((char) => {
          ctx.fillText(char, currentX, y);
          currentX += ctx.measureText(char).width + line.letterSpacing;
        });
      } else {
        ctx.fillText(line.text, x, y);
      }
    });

    console.log('[StampPreview] Canvas redraw complete');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <canvas
          key={canvasKey}
          ref={canvasRef}
          className="border border-gray-300 rounded cursor-pointer"
          onMouseDown={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) onDrag(e, rect);
          }}
          onMouseUp={onStopDragging}
        />
      </div>

      {showControls && (
        <div className="flex gap-2">
          <button
            onClick={onZoomOut}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={zoomLevel <= 0.5}
            aria-label="Zoom out preview"
          >
            Zoom Out
          </button>
          <span className="px-3 py-1 flex items-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={zoomLevel >= 2}
            aria-label="Zoom in preview"
          >
            Zoom In
          </button>
        </div>
      )}
    </div>
  );
};

export default StampPreviewEnhanced;
