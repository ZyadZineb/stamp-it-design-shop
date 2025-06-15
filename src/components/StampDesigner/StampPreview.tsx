import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PreviewCanvas from "./PreviewCanvas";
import { mmToPx } from "@/utils/dimensions";

interface StampPreviewProps {
  previewImage: string | null;
  productSize?: string;
  previewRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  activeLineIndex: number | null;
  includeLogo: boolean;
  downloadAsPng: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  highContrast?: boolean;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const StampPreview: React.FC<StampPreviewProps> = ({
  previewImage,
  productSize,
  previewRef,
  isDragging,
  activeLineIndex,
  includeLogo,
  downloadAsPng,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  highContrast = false,
  zoomLevel = 1,
  onZoomIn,
  onZoomOut
}) => {
  const { t } = useTranslation();
  
  // Add a grid pattern for precise alignment
  const gridSize = 5; // 5mm grid

  // Parse mm size
  let widthMm = 38, heightMm = 14;
  if (productSize) {
    const parts = productSize.replace("mm", "").split("x");
    if (parts.length === 2) {
      widthMm = parseFloat(parts[0]);
      heightMm = parseFloat(parts[1]);
    }
  }

  return (
    <Card className={highContrast ? "border-2 border-black" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-medium ${highContrast ? "text-black" : "text-gray-800"}`}>
            {t('preview.title', 'Stamp Preview')}
          </h3>
          
          <div className="flex items-center gap-2">
            {onZoomIn && onZoomOut && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onZoomOut} 
                  className="w-8 h-8 p-0" 
                  title={t('preview.zoomOut', 'Zoom Out')}
                >
                  <ZoomOut size={16} />
                </Button>
                <span className="text-sm text-gray-500">{Math.round(zoomLevel * 100)}%</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onZoomIn} 
                  className="w-8 h-8 p-0" 
                  title={t('preview.zoomIn', 'Zoom In')}
                >
                  <ZoomIn size={16} />
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAsPng}
              disabled={!previewImage}
              title={t('preview.download', 'Download')}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
        
        <PreviewCanvas
          widthMm={widthMm}
          heightMm={heightMm}
          showRuler={true}
          showBaselineBox={true}
          className="mx-auto"
        >
          {previewImage ? (
            <div 
              ref={previewRef}
              className="flex items-center justify-center w-full h-full select-none"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onMouseUp}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: isDragging ? "none" : "transform 0.2s ease-in-out",
                width: "100%",
                height: "100%"
              }}
            >
              <img 
                src={previewImage} 
                alt={t('preview.stampPreview', 'Stamp preview')}
                className="object-contain max-w-full max-h-full"
                style={{
                  width: "100%",
                  height: "100%"
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-50">
              <p className="text-gray-400">
                {t('preview.noPreview', 'No preview available')}
              </p>
            </div>
          )}
        </PreviewCanvas>
        
        {productSize && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              {t('preview.physicalSize', 'Physical size')}: {productSize}mm
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StampPreview;
