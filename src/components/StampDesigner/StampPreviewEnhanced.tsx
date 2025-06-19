
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

  // CRITICAL: Live preview - re-render on ANY design change
  useEffect(() => {
    console.log('[StampPreview] Live update triggered - props changed, re-rendering canvas');
    setCanvasKey(prev => prev + 1);
    
    // Use requestAnimationFrame to ensure DOM is ready for immediate updates
    requestAnimationFrame(() => {
      redrawCanvasWithLiveUpdates();
    });
  }, [
    lines, 
    inkColor, 
    includeLogo, 
    logoPosition, 
    logoImage, 
    shape, 
    borderStyle, 
    borderThickness, 
    zoomLevel,
    // Monitor deep changes in text lines
    JSON.stringify(lines.map(line => ({
      text: line.text,
      fontSize: line.fontSize,
      fontFamily: line.fontFamily,
      bold: line.bold,
      italic: line.italic,
      alignment: line.alignment,
      letterSpacing: line.letterSpacing,
      xPosition: line.xPosition,
      yPosition: line.yPosition
    })))
  ]);

  const redrawCanvasWithLiveUpdates = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('[StampPreview] Canvas ref not available for live update');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('[StampPreview] Canvas context not available for live update');
      return;
    }

    console.log('[StampPreview] LIVE REDRAW - Canvas updating with:', { 
      linesCount: lines.length, 
      inkColor, 
      shape, 
      borderStyle,
      borderThickness,
      zoomLevel
    });

    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size based on product and shape with live zoom
    const baseWidth = 200;
    const baseHeight = shape === 'circle' ? 200 : shape === 'oval' ? 150 : 120;
    canvas.width = baseWidth * zoomLevel;
    canvas.height = baseHeight * zoomLevel;

    // Scale context for current zoom level
    ctx.scale(zoomLevel, zoomLevel);

    // Draw background with live shape updates
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

    // Draw border with live style updates
    if (borderStyle !== 'none') {
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = borderThickness;
      
      // Live border style updates
      if (borderStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (borderStyle === 'dotted') {
        ctx.setLineDash([2, 2]);
      } else if (borderStyle === 'double') {
        ctx.setLineDash([]);
        // Draw double border
        ctx.lineWidth = Math.max(1, borderThickness / 3);
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(baseWidth/2, baseHeight/2, Math.min(baseWidth, baseHeight)/2 - 8, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(baseWidth/2, baseHeight/2, Math.min(baseWidth, baseHeight)/2 - 12, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (shape === 'oval') {
          ctx.beginPath();
          ctx.ellipse(baseWidth/2, baseHeight/2, baseWidth/2 - 8, baseHeight/2 - 8, 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(baseWidth/2, baseHeight/2, baseWidth/2 - 12, baseHeight/2 - 12, 0, 0, 2 * Math.PI);
          ctx.stroke();
        } else {
          ctx.strokeRect(8, 8, baseWidth - 16, baseHeight - 16);
          ctx.strokeRect(12, 12, baseWidth - 24, baseHeight - 24);
        }
        return; // Skip single border for double
      } else {
        ctx.setLineDash([]);
      }

      // Draw single border
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

    // Draw logo with live position updates
    if (includeLogo && logoImage) {
      const img = new Image();
      img.onload = () => {
        const logoSize = 30;
        let logoX = baseWidth/2 - logoSize/2;
        let logoY = baseHeight/2 - logoSize/2;

        // Live logo position updates
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

    // Draw text lines with live formatting updates
    lines.forEach((line, index) => {
      if (!line.text.trim()) return;

      // Live ink color updates
      ctx.fillStyle = inkColor;
      
      // Live font updates
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${line.fontSize || 16}px ${line.fontFamily || 'Arial'}`;
      
      // Live alignment updates
      ctx.textAlign = (line.alignment || 'center') as CanvasTextAlign;

      let x = baseWidth / 2;
      if (line.alignment === 'left') x = 20;
      if (line.alignment === 'right') x = baseWidth - 20;

      const lineHeight = Math.max((line.fontSize || 16) + 5, 25);
      const totalTextHeight = lines.filter(l => l.text.trim()).length * lineHeight;
      const startY = (baseHeight - totalTextHeight) / 2 + lineHeight;
      let y = startY + index * lineHeight;

      // Apply live custom positioning
      if (line.xPosition !== 0 || line.yPosition !== 0) {
        x += line.xPosition || 0;
        y += line.yPosition || 0;
      }

      // Apply live letter spacing
      if (line.letterSpacing && line.letterSpacing > 0) {
        // Manual letter spacing implementation for live updates
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

    console.log('[StampPreview] Live canvas redraw complete');
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
