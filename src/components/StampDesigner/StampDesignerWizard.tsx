import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, ChevronLeft, ChevronRight, Undo, Redo, Save, ZoomIn, ZoomOut, Wand, HelpCircle } from 'lucide-react';
import useStampDesignerEnhanced from '@/hooks/useStampDesignerEnhanced';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';
import WizardControls from './WizardControls';
import EnhancedTextEditor from './EnhancedTextEditor';
import StampPreviewAccessible from './StampPreviewAccessible';
import ColorSelector from './ColorSelector';
import LogoUploader from './LogoUploader';
import BorderStyleSelector from './BorderStyleSelector';
import ExportDesign from './ExportDesign';
import PreviewBackgrounds from './PreviewBackgrounds';
import PreviewOnPaper from './PreviewOnPaper';
import AutoArrange from './AutoArrange';
import { useIsMobile } from '@/hooks/use-mobile';
import { HelpTooltip } from '@/components/ui/tooltip-custom';

// Define the wizard step type
type WizardStepType = 'shape' | 'text' | 'color' | 'logo' | 'order';

interface StampDesignerWizardProps {
  product: Product | null;
  onAddToCart?: () => void;
  onPreview?: () => void;
  currentStep?: 'customize' | 'preview' | 'order';
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerWizard: React.FC<StampDesignerWizardProps> = ({
  product,
  onAddToCart,
  onPreview,
  currentStep: parentStep = 'customize',
  highContrast = false,
  largeControls = false
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  // Use the enhanced stamp designer hook
  const { 
    design, 
    updateLine, 
    addLine, 
    removeLine, 
    setInkColor,
    toggleLogo, 
    setLogoPosition,
    setBorderStyle,
    setBorderThickness,
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    generatePreview,
    validateDesign,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    loadDesign,
    hasSavedDesign,
    clearSavedDesign,
    applyTemplate,
    zoomIn,
    zoomOut,
    zoomLevel,
    svgRef,
    addElement,
    downloadAsPng,
    updateMultipleLines,
    enhancedAutoArrange
  } = useStampDesignerEnhanced(product);
  
  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStepType>('shape');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewBackground, setPreviewBackground] = useState<string>('none');
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Steps configuration with enhanced tooltips
  const steps = [
    { 
      id: 'shape' as WizardStepType, 
      labelKey: 'wizard.steps.shape.label', 
      label: t('wizard.steps.shape.label', 'Shape'), 
      descriptionKey: 'wizard.steps.shape.description', 
      description: t('wizard.steps.shape.description', 'Choose your stamp shape and border style'),
      tooltip: t('wizard.tooltips.shape', 'Set up the basic appearance of your stamp')
    },
    { 
      id: 'text' as WizardStepType, 
      labelKey: 'wizard.steps.text.label', 
      label: t('wizard.steps.text.label', 'Text'), 
      descriptionKey: 'wizard.steps.text.description', 
      description: t('wizard.steps.text.description', 'Add and position your text'),
      tooltip: t('wizard.tooltips.text', 'Click to edit font size, drag text to reposition')
    },
    { 
      id: 'color' as WizardStepType, 
      labelKey: 'wizard.steps.color.label', 
      label: t('wizard.steps.color.label', 'Color'), 
      descriptionKey: 'wizard.steps.color.description', 
      description: t('wizard.steps.color.description', 'Select ink color'),
      tooltip: t('wizard.tooltips.color', 'Choose from available ink colors')
    },
    { 
      id: 'logo' as WizardStepType, 
      labelKey: 'wizard.steps.logo.label', 
      label: t('wizard.steps.logo.label', 'Logo'), 
      descriptionKey: 'wizard.steps.logo.description', 
      description: t('wizard.steps.logo.description', 'Add a logo if needed'),
      tooltip: t('wizard.tooltips.logo', 'Upload and position your company logo')
    },
    { 
      id: 'order' as WizardStepType, 
      labelKey: 'wizard.steps.order.label', 
      label: t('wizard.steps.order.label', 'Order'), 
      descriptionKey: 'wizard.steps.order.description', 
      description: t('wizard.steps.order.description', 'Review and add your custom stamp to the cart'),
      tooltip: t('wizard.tooltips.order', 'Final step: confirm details and order your stamp')
    }
  ];
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Navigation functions
  const goToNextStep = () => {
    const errors = validateDesign(currentStep);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      } else if (onPreview) {
        onPreview();
      }
    }
  };
  
  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };
  
  const jumpToStep = (step: WizardStepType) => {
    setCurrentStep(step);
  };

  // Handle logo upload
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  useEffect(() => {
    if (uploadedLogo) {
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('nativeEvent' in event && 'clientX' in event.nativeEvent) {
      // Mouse event
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if ('touches' in event && event.touches.length > 0) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return; // Exit if we can't get coordinates
    }
    
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    // Calculate relative position (-100 to 100 range)
    const relativeX = ((clickX / rect.width) * 2 - 1) * 100;
    const relativeY = ((clickY / rect.height) * 2 - 1) * 100;
    
    // If a line is active, update its position
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    }
    // If no line is active but logo is included, update logo position
    else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

  // Start dragging (touch)
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if (event.touches.length === 0) return;
    handlePreviewClick(event);
  };

  // Mouse move handler for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    event.preventDefault();
    
    const rect = event.currentTarget.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Touch move handler for mobile drag support
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || event.touches.length === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
  };

  // Save current design
  const handleSaveDesign = () => {
    saveDesign();
    toast({
      title: t('design.saved', "Design saved"),
      description: t('design.savedDescription', "Your design has been saved and will be available when you return"),
    });
  };

  // Load saved design
  const handleLoadDesign = () => {
    loadDesign();
    toast({
      title: t('design.loaded', "Design loaded"),
      description: t('design.loadedDescription', "Your saved design has been loaded"),
    });
  };

  // Add to cart with validation
  const handleAddToCart = () => {
    if (!product) return;
    
    const errors = validateDesign('preview');
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      // Add the product to cart with the custom text and preview
      const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
      addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
      
      toast({
        title: t('cart.added', "Added to cart"),
        description: t('cart.addedDescription', "Your custom stamp has been added to your cart"),
      });
      
      // Call the optional callback
      if (onAddToCart) onAddToCart();
    }
  };
  
  // Handle applying AI suggestions
  const handleApplySuggestion = (suggestion: any) => {
    // This is a stub implementation - in a real app, you would parse the suggestion
    // and apply appropriate changes to the design
    toast({
      title: t('ai.suggestionApplied', "Suggestion applied"),
      description: suggestion.suggestion,
    });
  };
  
  // Handle adding elements like QR codes or barcodes
  const handleAddElement = (element: { type: string, dataUrl: string, width: number, height: number }) => {
    addElement(element);
    toast({
      title: t('design.elementAdded', `${element.type === 'qrcode' ? 'QR Code' : 'Barcode'} added`),
      description: t('design.elementAddedDescription', "Element added to your design. Adjust position in the preview."),
    });
  };

  // Handle setting preview background
  const handleSetBackground = (background: string) => {
    setPreviewBackground(background);
    
    toast({
      title: t('preview.backgroundChanged', "Background Changed"),
      description: t('preview.backgroundChangedDesc', "Preview background has been updated"),
    });
  };
  
  // Handle animation
  const handleAnimate = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };
  
  // Handle auto-arrange
  const handleAutoArrange = (updatedLines: any[]) => {
    updateMultipleLines(updatedLines);
    
    toast({
      title: t('design.autoArranged', "Layout Auto-Arranged"),
      description: t('design.autoArrangedDesc', "Text has been automatically arranged for optimal layout"),
    });
  };

  // Cleanup event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        stopDragging();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, stopDragging]);

  // Check for saved design on initial load
  useEffect(() => {
    if (product && hasSavedDesign()) {
      toast({
        title: t('design.savedFound', "Saved design found"),
        description: t('design.savedFoundDescription', "You have a saved design. Would you like to load it?"),
        action: (
          <Button onClick={handleLoadDesign} variant="outline" size="sm">
            {t('design.loadDesign', "Load Design")}
          </Button>
        ),
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className={`p-6 sm:p-8 text-center bg-white rounded-lg ${highContrast ? 'border-2 border-gray-800' : ''}`}>
        <p className={`text-base sm:text-lg ${highContrast ? 'text-black' : 'text-gray-500'}`}>
          {t('design.selectProduct', "Please select a product to start designing your stamp.")}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${highContrast ? 'border-2 border-gray-800' : ''}`}>
      <div className={`border-b ${highContrast ? 'border-gray-800 bg-gray-100' : 'border-gray-200 bg-gradient-to-r from-brand-blue to-blue-600'} p-4 sm:p-6`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-lg sm:text-xl font-semibold ${highContrast ? 'text-black' : 'text-white'}`}>
            {t('design.title', "Custom stamp designer")}
          </h2>
          <HelpTooltip content={t('design.productInfo', `Designing a ${product.name} stamp (${product.size}). You can add up to ${product.lines} lines of text and choose from ${product.inkColors.length} ink colors.`)}>
            <span className={`text-xs sm:text-sm ${highContrast ? 'text-black' : 'text-white/90'} flex items-center gap-1`}>
              <HelpCircle size={16} />
              {product.name} ({product.size})
            </span>
          </HelpTooltip>
        </div>
        {/* Progress indicator */}
        <div className="mt-4">
          <Progress 
            value={progress} 
            className={`h-2 ${highContrast ? 'bg-gray-300' : 'bg-white/20'}`} 
          />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <HelpTooltip key={step.id} content={step.tooltip}>
                <div 
                  className={`text-xs cursor-help ${isMobile ? 'hidden sm:block' : ''} ${
                    index <= currentStepIndex 
                      ? (highContrast ? 'text-black font-bold' : 'text-white font-medium') 
                      : (highContrast ? 'text-gray-600' : 'text-white/60')
                  }`}
                >
                  {step.labelKey ? t(step.labelKey) : step.label}
                </div>
              </HelpTooltip>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-center mt-1 text-white/80">
            {t('wizard.stepOf', 'Step {{current}} of {{total}}', { current: currentStepIndex + 1, total: steps.length })}:
            {' '}
            <strong>{t(steps[currentStepIndex].labelKey || '', steps[currentStepIndex].label)}</strong>
          </p>
        </div>
      </div>
      
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className={`${highContrast ? 'bg-red-100' : 'bg-red-50'} border-l-4 border-red-500 p-4 m-4`}>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                {t('validation.fixIssues', "Please fix the following issues:")}
              </h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Undo/Redo controls with tooltips */}
      <div className={`p-4 border-b ${highContrast ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-2`}>
        <div className="flex space-x-2">
          <HelpTooltip content={t('actions.undoTooltip', "Undo last action")}>
            <Button 
              variant={highContrast ? "default" : "outline"} 
              size={largeControls ? "default" : "sm"} 
              onClick={undo} 
              disabled={!canUndo}
              title={t('actions.undo', "Undo")}
              className={`${largeControls ? "h-12 w-12 p-0" : "min-h-[44px]"} ${!canUndo ? 'opacity-50' : 'hover:bg-brand-blue hover:text-white'}`}
            >
              <Undo size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
          <HelpTooltip content={t('actions.redoTooltip', "Redo last undone action")}>
            <Button 
              variant={highContrast ? "default" : "outline"} 
              size={largeControls ? "default" : "sm"} 
              onClick={redo} 
              disabled={!canRedo}
              title={t('actions.redo', "Redo")}
              className={`${largeControls ? "h-12 w-12 p-0" : "min-h-[44px]"} ${!canRedo ? 'opacity-50' : 'hover:bg-brand-blue hover:text-white'}`}
            >
              <Redo size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
        </div>
        
        <div className="flex space-x-2 flex-wrap">
          {hasSavedDesign() ? (
            <>
              <HelpTooltip content={t('design.loadSavedDesignTooltip', "Load your previously saved design")}>
                <Button 
                  variant={highContrast ? "default" : "outline"} 
                  size={largeControls ? "default" : "sm"} 
                  onClick={handleLoadDesign}
                  title={t('design.loadSavedDesign', "Load Saved Design")}
                  className="min-h-[44px] hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue"
                >
                  {t('design.loadDesign', "Load design")}
                </Button>
              </HelpTooltip>
              <HelpTooltip content={t('design.clearSavedDesignTooltip', "Clear saved design from storage")}>
                <Button 
                  variant={highContrast ? "default" : "outline"} 
                  size={largeControls ? "default" : "sm"} 
                  onClick={clearSavedDesign}
                  title={t('design.clearSavedDesign', "Clear Saved Design")}
                  className="min-h-[44px] hover:bg-red-500 hover:text-white border-red-500 text-red-500"
                >
                  {t('design.clearSaved', "Clear saved")}
                </Button>
              </HelpTooltip>
            </>
          ) : (
            <HelpTooltip content={t('design.saveDesignForLaterTooltip', "Save your current design to continue later")}>
              <Button 
                variant={highContrast ? "default" : "outline"} 
                size={largeControls ? "default" : "sm"} 
                onClick={handleSaveDesign}
                title={t('design.saveDesignForLater', "Save design for later")}
                className="min-h-[44px] hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue"
              >
                <Save size={largeControls ? 20 : 16} className="mr-1" />
                {t('design.saveDesign', "Save design")}
              </Button>
            </HelpTooltip>
          )}
        </div>
      </div>
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 ${isMobile ? 'flex flex-col-reverse' : ''}`}>
        {/* Left panel: Design options based on current step */}
        <div className={`space-y-4 sm:space-y-6 overflow-y-auto max-h-[70vh] ${largeControls ? 'text-lg' : ''}`}>
          {/* Auto-arrange button - Show on text step */}
          {currentStep === 'text' && (
            <AutoArrange 
              design={design} 
              onEnhancedAutoArrange={enhancedAutoArrange}
              shape={design.shape === "ellipse" ? "rectangle" : design.shape}
            />
          )}
          
          {currentStep === 'shape' && (
            <>
              <BorderStyleSelector 
                selectedStyle={design.borderStyle} 
                onStyleChange={setBorderStyle}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'text' && (
            <>
              <EnhancedTextEditor
                lines={design.lines}
                maxLines={product.lines}
                shape={design.shape === "ellipse" ? "rectangle" : design.shape}
                activeLineIndex={activeLineIndex}
                setActiveLineIndex={setActiveLineIndex}
                updateLine={updateLine}
                addLine={addLine}
                removeLine={removeLine}
                toggleCurvedText={toggleCurvedText}
                updateTextPosition={updateTextPosition}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'color' && (
            <>
              <ColorSelector 
                inkColors={product.inkColors} 
                selectedColor={design.inkColor} 
                onColorSelect={setInkColor}
              />
            </>
          )}
          
          {currentStep === 'logo' && (
            <>
              <LogoUploader
                includeLogo={design.includeLogo}
                toggleLogo={toggleLogo}
                logoX={design.logoX}
                logoY={design.logoY}
                uploadedLogo={uploadedLogo}
                onLogoUpload={handleLogoUpload}
                updateLogoPosition={updateLogoPosition}
                largeControls={largeControls}
              />
            </>
          )}
          
          {/* New 'order' step replaces preview */}
          {currentStep === 'order' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-brand-blue text-lg">
                    {product.name}
                  </h3>
                  <span className="font-bold text-2xl text-red-600">
                    {product.price} {t('common.currency', 'DHS')} TTC
                  </span>
                </div>
                <ul className="mb-2 text-gray-700 text-base">
                  <li>
                    <span className="font-semibold">
                      {t('design.summary.inkColor', 'Ink color')}
                    </span>
                    {': '}
                    <span>
                      {t(`inkColors.${design.inkColor}`, design.inkColor)}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {t('design.summary.shape', 'Shape')}
                    </span>
                    {': '}
                    <span>
                      {t(`shapes.${design.shape}`, design.shape)}
                    </span>
                  </li>
                  <li>
                    <span className="font-semibold">
                      {t('design.summary.border', 'Border')}
                    </span>
                    {': '}
                    {design.borderStyle !== "none"
                      ? `${t(`borderStyle.${design.borderStyle}`, design.borderStyle)} (${design.borderThickness})`
                      : t('design.summary.noBorder', "No border")}
                  </li>
                </ul>
                <Button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-lg font-semibold min-h-[48px]"
                  data-testid="add-to-cart-btn"
                >
                  {t('cart.addToCart', "Ajouter au panier")}
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {t('design.summary.editAnyStep', "You can edit your design in any previous step before adding to cart.")}
              </p>
            </div>
          )}
        </div>
        
        {/* Right panel: Preview and navigation controls */}
        <div className="space-y-4 sm:space-y-6">
          <StampPreviewAccessible
            previewImage={previewImage}
            productSize={product.size}
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            downloadAsPng={downloadAsPng}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            zoomLevel={zoomLevel}
            background={previewBackground}
            highContrast={highContrast}
            largeControls={largeControls}
            isAnimating={showAnimation}
          />
          <WizardControls 
            currentStep={currentStep} 
            steps={steps as any}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onJump={jumpToStep}
            largeControls={largeControls}
          />
        </div>
      </div>
    </div>
  );
};

export default StampDesignerWizard;
