
import React, { useEffect, useRef, useState } from 'react';
import { StampTextLine, Product } from '@/types';
import ReactiveStampCanvas from './ReactiveStampCanvas';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Convert shape from preview format to canvas format
  const convertShapeForCanvas = (previewShape: 'rectangle' | 'circle' | 'oval'): 'rectangle' | 'circle' | 'ellipse' | 'square' => {
    switch (previewShape) {
      case 'oval':
        return 'ellipse';
      case 'circle':
        return 'circle';
      case 'rectangle':
      default:
        return 'rectangle';
    }
  };

  const handleCanvasUpdate = (imageData: string) => {
    console.log('[StampPreviewEnhanced] Canvas updated, new preview image generated');
    setPreviewImage(imageData);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <ReactiveStampCanvas
        lines={lines}
        inkColor={inkColor}
        includeLogo={includeLogo}
        logoPosition={logoPosition}
        logoImage={logoImage}
        shape={convertShapeForCanvas(shape)}
        borderStyle={borderStyle}
        borderThickness={borderThickness}
        product={product}
        zoomLevel={zoomLevel}
        onCanvasUpdate={handleCanvasUpdate}
        className="cursor-pointer"
      />

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
