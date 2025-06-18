import React, { Suspense, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Check } from 'lucide-react';
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
import WhatsAppOrderFlow from './WhatsAppOrderFlow';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { toast } from "@/hooks/use-toast";
const ExportDesign = React.lazy(() => import("./ExportDesign"));
const BarcodeGenerator = React.lazy(() => import("./BarcodeGenerator"));

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
  
  // Use the unified hook (which does logging, debouncing, etc)
  const designer = useStampDesigner(product);

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
  } = designer;

  const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];

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
    
    // Show confirmation toast
    toast({
      title: "✅ WhatsApp Opened",
      description: "WhatsApp launched — send your message to complete your order.",
      duration: 5000,
    });
    
    if (onPreview) {
      onPreview();
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

  // Convert shape for TemplateSelector - handle ellipse -> oval conversion
  const convertShapeForTemplate = (shape: string): 'rectangle' | 'circle' | 'oval' => {
    if (shape === 'ellipse') return 'oval';
    if (shape === 'square') return 'rectangle';
    return shape as 'rectangle' | 'circle' | 'oval';
  };

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
              {t('steps.preview', "Order")}
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
                      productShape={convertShapeForTemplate(design.shape)}
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
                      logoImage={design.logoImage}
                      logoPosition={design.logoPosition}
                      onToggleLogo={toggleLogo}
                      onLogoUpload={applyTemplate}
                      onPositionChange={setLogoPosition}
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
                      availableColors={product?.inkColors || []}
                      selectedColor={design.inkColor}
                      onColorSelect={setInkColor}
                      highContrast={highContrast}
                      largeControls={largeControls}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{t('preview.title', "Order Your Stamp")}</h2>
                    <p className="text-gray-600 mb-6">{t('preview.description', "Review your stamp design and order via WhatsApp.")}</p>
                    
                    <WhatsAppOrderFlow 
                      product={product}
                      previewImage={previewImage}
                    />
                    
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
                      lines={design.lines}
                      inkColor={design.inkColor}
                      includeLogo={design.includeLogo}
                      logoPosition={design.logoPosition}
                      logoImage={design.logoImage}
                      shape={design.shape === 'ellipse' ? 'oval' : design.shape === 'square' ? 'rectangle' : design.shape as 'rectangle' | 'circle' | 'oval'}
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
                      showControls={currentStep === 'preview'}
                    />
                  )}
                  
                  <div className="mt-6">
                    <Button 
                      onClick={currentStep === 'preview' ? handleWhatsAppOrder : handleNextStep}
                      className={`w-full ${largeControls ? "text-lg py-4" : ""} ${currentStep === 'preview' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      variant={currentStep === 'preview' ? "default" : "outline"}
                    >
                      {currentStep === 'preview' ? (
                        <>
                          <MessageCircle className="mr-2" size={largeControls ? 20 : 16} />
                          {t('preview.orderWhatsApp', "Order via WhatsApp")}
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
    </div>
  );
};

export default StampDesignerMain;
