import React, { Suspense } from "react";
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Check } from 'lucide-react';
import StampPreview from './StampPreview';
import StampPreviewEnhanced from './StampPreviewEnhanced';
import StampPreviewAccessible from './StampPreviewAccessible';
import PreviewOnPaper from './PreviewOnPaper';
import SummaryBar from './SummaryBar';
import StepNavigationControls from './StepNavigationControls';
import TextEditor from './TextEditor';
import BorderSelector from './BorderSelector';
import TemplateSelector from './TemplateSelector';
import LogoUploader from './LogoUploader';
import ColorSelector from './ColorSelector';
import { useRef, useState } from 'react';
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
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<StepType>(initialStep);
  const [isAnimating, setIsAnimating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const {
    design,
    updateLine,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    updateLogoPosition,
    setBorderStyle,
    setBorderThickness,
    toggleCurvedText,
    updateTextPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate,
    updateMultipleLines,
    enhancedAutoArrange,
    setGlobalAlignment
  } = useStampDesigner(product);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some(line => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    } else {
      const activeLineIndex = design.lines.findIndex(line => line.isDragging);
      if (activeLineIndex !== -1) {
        startTextDrag(activeLineIndex);
      } else if (design.includeLogo) {
        startLogoDrag();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some(line => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some(line => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    } else {
      const activeLineIndex = design.lines.findIndex(line => line.isDragging);
      if (activeLineIndex !== -1) {
        startTextDrag(activeLineIndex);
      } else if (design.includeLogo) {
        startLogoDrag();
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    if (design.lines.some(line => line.isDragging) || design.logoDragging) {
      handleDrag(e, rect);
    }
  };

  const handleNextStep = () => {
    const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handlePreview = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    if (onPreview) {
      onPreview();
    }
  };

  const activeLineIndex = design.lines.findIndex(line => line.isDragging);
  const isDragging = design.lines.some(line => line.isDragging) || design.logoDragging;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <Tabs defaultValue={currentStep} value={currentStep} onValueChange={(value) => setCurrentStep(value as StepType)}>
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="templates" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.templates', "Templates")}
            </TabsTrigger>
            <TabsTrigger value="logo" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.logo', "Logo")}
            </TabsTrigger>
            <TabsTrigger value="text" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.text', "Text")}
            </TabsTrigger>
            <TabsTrigger value="border" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.border', "Border")}
            </TabsTrigger>
            <TabsTrigger value="color" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.color', "Color")}
            </TabsTrigger>
            <TabsTrigger value="preview" className={largeControls ? "text-lg py-3 px-5" : ""}>
              {t('steps.preview', "Preview")}
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Editor */}
            <div className="md:col-span-2">
              <TabsContent value="templates">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('templates.title', "Choose a Template")}</h2>
                    <p className="text-gray-600 mb-6">{t('templates.description', "Start with a pre-designed template or create your own from scratch.")}</p>
                    <TemplateSelector 
                      onSelectTemplate={applyTemplate} 
                      productShape={design.shape}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logo">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('logo.title', "Add Your Logo")}</h2>
                    <p className="text-gray-600 mb-6">{t('logo.description', "Upload and position your logo or skip this step.")}</p>
                    <LogoUploader 
                      includeLogo={design.includeLogo}
                      onToggleLogo={toggleLogo}
                      onSetLogoPosition={setLogoPosition}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('text.title', "Add Your Text")}</h2>
                    <p className="text-gray-600 mb-6">{t('text.description', "Enter the text for your stamp and customize the font and style.")}</p>
                    <TextEditor 
                      lines={design.lines}
                      onUpdateLine={updateLine}
                      onAddLine={addLine}
                      onRemoveLine={removeLine}
                      onToggleCurvedText={toggleCurvedText}
                      onStartTextDrag={startTextDrag}
                      maxLines={product?.lines || 5}
                      shape={design.shape}
                      onAutoArrange={enhancedAutoArrange}
                      onSetGlobalAlignment={setGlobalAlignment}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="border">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('border.title', "Choose Border Style")}</h2>
                    <p className="text-gray-600 mb-6">{t('border.description', "Select a border style for your stamp.")}</p>
                    <BorderSelector 
                      borderStyle={design.borderStyle}
                      borderThickness={design.borderThickness}
                      onSetBorderStyle={setBorderStyle}
                      onSetBorderThickness={setBorderThickness}
                      shape={design.shape}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="color">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('color.title', "Choose Ink Color")}</h2>
                    <p className="text-gray-600 mb-6">{t('color.description', "Select the ink color for your stamp.")}</p>
                    <ColorSelector 
                      selectedColor={design.inkColor}
                      onSelectColor={setInkColor}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('preview.title', "Preview Your Stamp")}</h2>
                    <p className="text-gray-600 mb-6">{t('preview.description', "Review your stamp design before adding to cart.")}</p>
                    <PreviewOnPaper 
                      previewImage={previewImage}
                      productName={product?.name || ''}
                      onAnimate={handlePreview}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                    <Separator className="my-6" />
                    <Suspense fallback={<div>Loading export tools…</div>}>
                      <ExportDesign 
                        svgRef={null}
                        previewImage={previewImage}
                        productName={product?.name || ''}
                        downloadAsPng={downloadAsPng}
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Right Column - Preview */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t('preview.livePreview', "Live Preview")}</h3>
                  
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
                    />
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      onClick={currentStep === 'preview' ? handleAddToCart : handleNextStep}
                      className={`w-full ${largeControls ? "text-lg py-4" : ""}`}
                      variant={currentStep === 'preview' ? "default" : "outline"}
                    >
                      {currentStep === 'preview' ? (
                        <>
                          <ShoppingCart className="mr-2" size={largeControls ? 20 : 16} />
                          {t('preview.addToCart', "Add to Cart")}
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
            </div>
          </div>
        </Tabs>
      </div>

      <div className="mt-6">
        <StepNavigationControls
          currentStep={currentStep}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          largeControls={largeControls}
        />
      </div>

      <div className="mt-6">
        <SummaryBar
          product={
            product || {
              id: '',
              name: '',
              price: 0,
              size: '',
              lines: 0,
              inkColors: [],
              shape: 'rectangle',
              brand: '',
              model: '',
              colors: [],
              images: [],
              description: ''
            }
          }
          inkColor={design.inkColor}
          price={product?.price || 0}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default StampDesignerMain;
