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

import BaseStampRenderer from "./BaseStampRenderer";
import { calcAlignedX, calcCenteredY } from "@/lib/previewEngine";

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
  onTouchEnd,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel = 1,
  background = 'none',
  highContrast = false,
  largeControls = false,
  isAnimating = false
}) => {
  const { t } = useTranslation();
  const sizeParts = productSize.replace('mm', '').split('x');
  const widthMm = parseFloat(sizeParts[0]) || 38;
  const heightMm = parseFloat(sizeParts[1]) || 14;

  return (
    <BaseStampRenderer
      widthMm={widthMm}
      heightMm={heightMm}
      highContrast={highContrast}
      zoomLevel={zoomLevel}
      background={background}
      isAnimating={isAnimating}
      ariaLabel={t("preview.ariaLabel", "Stamp preview area")}
    >
      {previewImage ? (
        <img
          src={previewImage}
          alt={t("preview.stampDesign", "Stamp design")}
          className="object-contain w-full h-full"
          style={{
            imageRendering: "auto"
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-gray-400 text-center">
            {t("preview.noPreview", "No preview available")}
          </span>
        </div>
      )}
    </BaseStampRenderer>
  );
};

export default StampPreviewAccessible;
