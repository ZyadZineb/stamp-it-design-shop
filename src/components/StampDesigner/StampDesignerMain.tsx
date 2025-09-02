import React, { Suspense, useState } from "react";
import { Product } from '@/types';
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import StampDesignerTabs from './StampDesignerTabs';
import StampDesignerPreview from './StampDesignerPreview';
import StepNavigationControls from './StepNavigationControls';
import CartModal from './CartModal';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useStampDesignerCore } from './StampDesignerCore';
const ExportDesign = React.lazy(() => import("./ExportDesign"));

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

interface StampDesignerMainProps {
  product: Product | null;
  onAddToCart?: () => void;
  onPreview?: () => void;
  initialStep?: StepType;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerMain: React.FC<StampDesignerMainProps> = ({
  product,
  onAddToCart,
  onPreview,
  initialStep = 'templates',
  highContrast = false,
  largeControls = false
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>(initialStep);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  
  const {
    designer,
    previewRef,
    handleAddToCart,
    getItemCount,
    convertShapeForPreview,
    t
  } = useStampDesignerCore(product);

  const { design, handleDrag, stopDragging, previewImage, downloadAsPng } = designer;
  const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some((line: any) => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    } else {
      const activeLineIndex = design.lines.findIndex((line: any) => line.isDragging);
      if (activeLineIndex !== -1) {
        designer.startTextDrag(activeLineIndex);
      } else if (design.includeLogo) {
        designer.startLogoDrag();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some((line: any) => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some((line: any) => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    } else {
      const activeLineIndex = design.lines.findIndex((line: any) => line.isDragging);
      if (activeLineIndex !== -1) {
        designer.startTextDrag(activeLineIndex);
      } else if (design.includeLogo) {
        designer.startLogoDrag();
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some((line: any) => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    }
  };
  
  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleWhatsAppOrder = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    toast({
      title: "✅ WhatsApp Opened",
      description: "WhatsApp launched — send your message to complete your order.",
      duration: 5000,
    });
    
    if (onPreview) {
      onPreview();
    }
  };

  const activeLineIndex = design.lines.findIndex((line: any) => line.isDragging);
  const isDragging = design.lines.some((line: any) => line.isDragging) || design.logoDragging;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2">
            <StampDesignerTabs
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              product={product}
              design={design}
              designer={designer}
              convertShapeForPreview={convertShapeForPreview}
              highContrast={highContrast}
              largeControls={largeControls}
            />

            {currentStep === 'preview' && (
              <>
                <Separator className="my-6" />
                <ErrorBoundary>
                  <Suspense fallback={<div className="p-4 text-gray-400">Loading export tools…</div>}>
                    <ExportDesign 
                      svgRef={null}
                      previewImage={previewImage}
                      productName={product?.name || ''}
                      downloadAsPng={downloadAsPng}
                    />
                  </Suspense>
                </ErrorBoundary>
              </>
            )}
          </div>

          {/* Right Column - Preview (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 z-10">
              <StampDesignerPreview
              currentStep={currentStep}
              product={product}
              design={design}
              designer={designer}
              convertShapeForPreview={convertShapeForPreview}
              handleAddToCart={handleAddToCart}
              getItemCount={getItemCount}
              setShowCartModal={setShowCartModal}
              handleWhatsAppOrder={handleWhatsAppOrder}
              handleNextStep={handleNextStep}
              isAnimating={isAnimating}
              highContrast={highContrast}
              largeControls={largeControls}
              previewRef={previewRef}
              activeLineIndex={activeLineIndex}
              isDragging={isDragging}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              stopDragging={stopDragging}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <StepNavigationControls
          currentStep={currentStep}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          largeControls={largeControls}
        />
      </div>

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onProceedToCheckout={() => {
          setShowCartModal(false);
          setCurrentStep('preview');
        }}
      />
    </div>
  );
};

export default StampDesignerMain;
