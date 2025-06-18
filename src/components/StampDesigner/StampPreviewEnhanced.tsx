
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

  // Force re-render whenever any prop changes
  useEffect(() => {
    setCanvasKey(prev => prev + 1);
    redrawCanvas();
  }, [lines, inkColor, includeLogo, logoPosition, logoImage, shape, borderStyle, borderThickness, zoomLevel]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size based on product
    const baseWidth = 200;
    const baseHeight = shape === 'circle' ? 200 : shape === 'oval' ? 150 : 120;
    canvas.width = baseWidth * zoomLevel;
    canvas.height = baseHeight * zoomLevel;

    // Scale context
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

    // Draw text lines
    lines.forEach((line, index) => {
      if (!line.text.trim()) return;

      ctx.fillStyle = inkColor;
      ctx.font = `${line.bold ? 'bold ' : ''}${line.italic ? 'italic ' : ''}${line.fontSize}px ${line.fontFamily}`;
      ctx.textAlign = line.alignment as CanvasTextAlign;

      let x = baseWidth / 2;
      if (line.alignment === 'left') x = 20;
      if (line.alignment === 'right') x = baseWidth - 20;

      const lineHeight = 25;
      const totalTextHeight = lines.length * lineHeight;
      const startY = (baseHeight - totalTextHeight) / 2 + lineHeight;
      let y = startY + index * lineHeight;

      // Apply custom positioning if set
      if (line.xPosition !== 0 || line.yPosition !== 0) {
        x += line.xPosition;
        y += line.yPosition;
      }

      ctx.fillText(line.text, x, y);
    });
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
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={zoomLevel <= 0.5}
          >
            Zoom Out
          </button>
          <span className="px-3 py-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={zoomLevel >= 2}
          >
            Zoom In
          </button>
        </div>
      )}
    </div>
  );
};

export default StampPreviewEnhanced;
