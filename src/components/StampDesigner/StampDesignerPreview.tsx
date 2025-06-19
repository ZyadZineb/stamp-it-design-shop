
import React from "react";
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, MessageCircle } from 'lucide-react';
import StampPreviewEnhanced from './StampPreviewEnhanced';
import StampPreviewAccessible from './StampPreviewAccessible';

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

interface StampDesignerPreviewProps {
  currentStep: StepType;
  product: Product | null;
  design: any;
  designer: any;
  convertShapeForPreview: (shape: string) => 'rectangle' | 'circle' | 'oval';
  handleAddToCart: () => boolean;
  getItemCount: () => number;
  setShowCartModal: (show: boolean) => void;
  handleWhatsAppOrder: () => void;
  handleNextStep: () => void;
  isAnimating: boolean;
  highContrast?: boolean;
  largeControls?: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  activeLineIndex: number;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  stopDragging: () => void;
}

const StampDesignerPreview: React.FC<StampDesignerPreviewProps> = ({
  currentStep,
  product,
  design,
  designer,
  convertShapeForPreview,
  handleAddToCart,
  getItemCount,
  setShowCartModal,
  handleWhatsAppOrder,
  handleNextStep,
  isAnimating,
  highContrast = false,
  largeControls = false,
  previewRef,
  activeLineIndex,
  isDragging,
  handleMouseDown,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
  stopDragging
}) => {
  const { t } = useTranslation();

  const {
    zoomIn,
    zoomOut,
    zoomLevel,
    startTextDrag,
    startLogoDrag,
    handleDrag,
    previewImage,
    downloadAsPng
  } = designer;

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{t('preview.livePreview', "Live Preview")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCartModal(true)}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={16} />
            Cart ({getItemCount()})
          </Button>
        </div>
        
        {currentStep === 'preview' ? (
          <StampPreviewAccessible
            previewImage={previewImage}
            productSize={product?.size || ''}
            isDragging={isDragging}
            activeLineIndex={activeLineIndex}
            includeLogo={design.includeLogo}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            downloadAsPng={downloadAsPng}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            zoomLevel={zoomLevel}
            highContrast={highContrast}
            largeControls={largeControls}
            isAnimating={isAnimating}
          />
        ) : (
          <StampPreviewEnhanced
            lines={design.lines}
            inkColor={design.inkColor}
            includeLogo={design.includeLogo}
            logoPosition={design.logoPosition}
            logoImage={design.logoImage}
            shape={convertShapeForPreview(design.shape)}
            borderStyle={design.borderStyle}
            borderThickness={design.borderThickness}
            product={product}
            zoomLevel={zoomLevel}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onTextDrag={startTextDrag}
            onLogoDrag={startLogoDrag}
            onDrag={handleDrag}
            onStopDragging={stopDragging}
            showControls={false}
          />
        )}
        
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleAddToCart}
            className={`w-full min-h-[44px] ${largeControls ? "text-lg py-4" : ""} bg-blue-600 hover:bg-blue-700`}
            variant="default"
          >
            <ShoppingCart className="mr-2" size={largeControls ? 20 : 16} />
            Add to Cart
          </Button>
          
          <Button 
            onClick={currentStep === 'preview' ? handleWhatsAppOrder : handleNextStep}
            className={`w-full min-h-[44px] ${largeControls ? "text-lg py-4" : ""} ${currentStep === 'preview' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            variant={currentStep === 'preview' ? "default" : "outline"}
          >
            {currentStep === 'preview' ? (
              <>
                <MessageCircle className="mr-2" size={largeControls ? 20 : 16} />
                📩 Order via WhatsApp
              </>
            ) : (
              <>
                <Check className="mr-2" size={largeControls ? 20 : 16} />
                {t('preview.continue', "Continue")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StampDesignerPreview;
