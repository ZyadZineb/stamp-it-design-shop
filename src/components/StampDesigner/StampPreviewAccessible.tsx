
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StampPreviewAccessibleProps {
  previewImage: string | null;
  productSize: string;
  isDragging: boolean;
  activeLineIndex: number | null;
  includeLogo: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomLevel: number;
  background?: string;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampPreviewAccessible: React.FC<StampPreviewAccessibleProps> = ({
  previewImage,
  productSize,
  isDragging,
  activeLineIndex,
  includeLogo,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel,
  background = 'none',
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Get background styles based on selected background
  const getBackgroundStyle = () => {
    switch (background) {
      case 'paper':
        return { 
          backgroundColor: '#f8f8f8',
          backgroundImage: 'url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'envelope':
        return { 
          backgroundColor: '#f1f0ed',
          backgroundImage: 'url(https://images.unsplash.com/photo-1473091534298-04dcbce3278c)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'cardboard':
        return { 
          backgroundColor: '#d4c8b8',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      case 'fabric':
        return { 
          backgroundColor: '#e2d1c3',
          backgroundImage: 'url(https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  // Get cursor style based on drag state
  const getCursorStyle = () => {
    if (isDragging) return 'cursor-grabbing';
    if (activeLineIndex !== null || includeLogo) return 'cursor-grab';
    return 'cursor-default';
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enable keyboard navigation for active elements (text lines or logo)
    if (activeLineIndex !== null || includeLogo) {
      const STEP = 5; // pixels to move
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          const upEvent = new MouseEvent('mousemove', {
            clientX: (previewRef.current?.getBoundingClientRect().left || 0) + (previewRef.current?.offsetWidth || 0) / 2,
            clientY: (previewRef.current?.getBoundingClientRect().top || 0) + (previewRef.current?.offsetHeight || 0) / 2 - STEP
          });
          previewRef.current?.dispatchEvent(upEvent);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const downEvent = new MouseEvent('mousemove', {
            clientX: (previewRef.current?.getBoundingClientRect().left || 0) + (previewRef.current?.offsetWidth || 0) / 2,
            clientY: (previewRef.current?.getBoundingClientRect().top || 0) + (previewRef.current?.offsetHeight || 0) / 2 + STEP
          });
          previewRef.current?.dispatchEvent(downEvent);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const leftEvent = new MouseEvent('mousemove', {
            clientX: (previewRef.current?.getBoundingClientRect().left || 0) + (previewRef.current?.offsetWidth || 0) / 2 - STEP,
            clientY: (previewRef.current?.getBoundingClientRect().top || 0) + (previewRef.current?.offsetHeight || 0) / 2
          });
          previewRef.current?.dispatchEvent(leftEvent);
          break;
        case 'ArrowRight':
          e.preventDefault();
          const rightEvent = new MouseEvent('mousemove', {
            clientX: (previewRef.current?.getBoundingClientRect().left || 0) + (previewRef.current?.offsetWidth || 0) / 2 + STEP,
            clientY: (previewRef.current?.getBoundingClientRect().top || 0) + (previewRef.current?.offsetHeight || 0) / 2
          });
          previewRef.current?.dispatchEvent(rightEvent);
          break;
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">{t('preview.title', 'Preview')}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size={largeControls ? "default" : "sm"}
            onClick={zoomOut}
            disabled={zoomLevel <= 1}
            title={t('preview.zoomOut', "Zoom Out")}
            aria-label={t('preview.zoomOut', "Zoom Out")}
          >
            <ZoomOut size={largeControls ? 20 : 16} />
          </Button>
          <Button
            variant="outline"
            size={largeControls ? "default" : "sm"}
            onClick={zoomIn}
            disabled={zoomLevel >= 3}
            title={t('preview.zoomIn', "Zoom In")}
            aria-label={t('preview.zoomIn', "Zoom In")}
          >
            <ZoomIn size={largeControls ? 20 : 16} />
          </Button>
          <Button
            variant="outline"
            size={largeControls ? "default" : "sm"}
            onClick={downloadAsPng}
            title={t('preview.download', "Download Preview")}
            aria-label={t('preview.download', "Download Preview")}
          >
            <Download size={largeControls ? 20 : 16} />
          </Button>
        </div>
      </div>

      <div
        className={`relative border rounded-lg overflow-hidden ${
          highContrast ? 'border-gray-900' : 'border-gray-200'
        } mx-auto mb-4`}
        style={{ maxWidth: '100%', height: '280px', ...getBackgroundStyle() }}
      >
        <div
          ref={previewRef}
          className={`flex items-center justify-center h-full w-full ${getCursorStyle()} ${
            highContrast ? 'bg-black bg-opacity-5' : ''
          }`}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          role="application"
          aria-label={t('preview.ariaLabel', 'Stamp preview area. Use arrow keys to position elements when selected.')}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseUp}
        >
          {previewImage ? (
            <div className={`relative ${isDragging ? 'animate-pulse' : ''}`}>
              <img
                src={previewImage}
                alt={t('preview.stampPreview', 'Stamp Preview')}
                className={`max-w-full max-h-full object-contain ${
                  highContrast ? 'contrast-125 brightness-110' : ''
                }`}
                style={{
                  filter: isDragging ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' : 'none',
                }}
              />
              {activeLineIndex !== null && (
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                  highContrast ? 'bg-blue-700 bg-opacity-10' : 'bg-blue-500 bg-opacity-5'
                }`}>
                  <span className="text-xs text-blue-600 font-medium bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm"
                        aria-live="polite">
                    {t('preview.movingText', 'Moving text line {{index}}', {index: activeLineIndex + 1})}
                  </span>
                </div>
              )}
              {includeLogo && !activeLineIndex && isDragging && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs text-blue-600 font-medium bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm"
                        aria-live="polite">
                    {t('preview.movingLogo', 'Moving logo')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
              <p>{t('preview.noPreview', 'Preview will appear here')}</p>
              <p className="text-sm mt-2">{t('preview.customizeStamp', 'Customize your stamp to see a preview')}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        {productSize && (
          <p>{t('preview.physicalSize', 'Physical size: {{size}}mm', {size: productSize})}</p>
        )}
        <p className="text-xs mt-1">
          {t('preview.dragInstructions', 'Click and drag elements to reposition them')}
        </p>
      </div>
    </div>
  );
};

export default StampPreviewAccessible;
