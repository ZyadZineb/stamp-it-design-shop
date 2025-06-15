
// Unifies Preview rendering: Only uses PreviewCanvas for the main preview logic.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PreviewCanvas from './PreviewCanvas';

interface StampPreviewAccessibleProps {
  previewImage: string | null;
  productSize: string;
  isDragging?: boolean;
  activeLineIndex?: number | null;
  includeLogo?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void; // <-- ADDED
  downloadAsPng?: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomLevel?: number;
  background?: string;
  highContrast?: boolean;
  largeControls?: boolean;
  isAnimating?: boolean;
}

const StampPreviewAccessible: React.FC<StampPreviewAccessibleProps> = ({
  previewImage,
  productSize,
  isDragging = false,
  activeLineIndex = null,
  includeLogo = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd, // <-- ADDED
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel = 1,
  background = 'none',
  highContrast = false,
  largeControls = false,
  isAnimating = false
}) => {
  // Calculate preview physical dimensions from productSize string (e.g. "60x40" or "38x14mm")
  const sizeParts = productSize.replace('mm', '').split('x');
  const widthMm = parseFloat(sizeParts[0]) || 38;
  const heightMm = parseFloat(sizeParts[1]) || 14;

  return (
    <PreviewCanvas
      previewImage={previewImage}
      widthMm={widthMm}
      heightMm={heightMm}
      productSize={productSize}
      isDragging={isDragging}
      activeLineIndex={activeLineIndex}
      includeLogo={includeLogo}
      highContrast={highContrast}
      zoomLevel={zoomLevel}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      downloadAsPng={downloadAsPng}
      largeControls={largeControls}
      background={background}
      isAnimating={isAnimating}
      // Direct drag handlers
      onCanvasMouseDown={onMouseDown}
      onCanvasMouseMove={onMouseMove}
      onCanvasMouseUp={onMouseUp}
      onCanvasTouchStart={onTouchStart}
      onCanvasTouchMove={onTouchMove}
      onCanvasTouchEnd={onTouchEnd} {/* <-- CORRECT TYPE */}
    />
  );
};

export default StampPreviewAccessible;
