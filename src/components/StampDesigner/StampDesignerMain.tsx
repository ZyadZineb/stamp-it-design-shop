
import React, { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import TextLinesEditor from './TextLinesEditor';
import StampPreview from './StampPreview';
import ColorSelector from './ColorSelector';
import LogoUploader from './LogoUploader';
import BorderStyleSelector from './BorderStyleSelector';
import SampleDesigns from './SampleDesigns';
import ProfessionalCircularTemplates from './ProfessionalCircularTemplates';
import AutoArrange from './AutoArrange';
import StampPreviewAccessible from './StampPreviewAccessible';

interface StampDesignerMainProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerMain: React.FC<StampDesignerMainProps> = ({ 
  product, 
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
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
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate,
    updateMultipleLines,
    enhancedAutoArrange,
    setGlobalAlignment
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview'>('logo');

  // Utility to provide the correct shape for components expecting "rectangle" | "circle" | "square"
  const getCompatibleShape = (
    shape: "rectangle" | "circle" | "square" | "ellipse"
  ): "rectangle" | "circle" | "square" => {
    // Treat 'ellipse' as 'rectangle' for these components
    if (shape === "ellipse") return "rectangle";
    return shape;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the product to cart with the custom text and preview
    const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
    addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
    
    // Call the optional callback
    if (onAddToCart) onAddToCart();
  };

  // Handle logo upload (simulated)
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    // In a real app, this would connect to a file upload component
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  React.useEffect(() => {
    if (uploadedLogo) {
      // Update the stamp design with the uploaded logo
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
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

  // Mouse move handler for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    event.preventDefault();
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Touch move handler for mobile drag support
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

  // Start dragging (touch)
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if (!previewRef.current || event.touches.length === 0) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    
    const relativeX = ((touch.clientX - rect.left) / rect.width * 2 - 1) * 100;
    const relativeY = ((touch.clientY - rect.top) / rect.height * 2 - 1) * 100;
    
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    } else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
  };

  // Cleanup event listeners
  React.useEffect(() => {
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

  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep === 'templates') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('color');
    else if (currentStep === 'color') setCurrentStep('preview');
  };

  // Navigate to the previous step
  const goToPrevStep = () => {
    if (currentStep === 'preview') setCurrentStep('color');
    else if (currentStep === 'color') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('templates');
  };

  if (!product) {
    return (
      <div className="p-8 text-center bg-white rounded-lg">
        <p className="text-gray-500">Please select a product to start designing your stamp.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold">Professional Stamp Designer</h2>
        <p className="text-sm text-gray-600">Designing: {product.name} ({product.size})</p>
        
        {/* Design progress indicator emphasizing logo-first approach */}
        <div className="flex mt-4 border-t pt-4">
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'templates' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('templates')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
            Templates
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'logo' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('logo')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'logo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
            Logo
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'text' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('text')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
            Text
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'border' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('border')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'border' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>4</div>
            Border
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'color' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('color')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>5</div>
            Color
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium cursor-pointer ${currentStep === 'preview' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('preview')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>6</div>
            Preview
          </div>
        </div>
      </div>
      
      {/* Layout changes for preview step to show clean design */}
      {currentStep === 'preview' ? (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Final Preview</h2>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-8">
              <StampPreviewAccessible
                previewImage={previewImage}
                productSize={product.size}
                isDragging={isDragging}
                activeLineIndex={activeLineIndex}
                includeLogo={design.includeLogo}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handlePreviewClick(e);
                }}
                onMouseMove={(e) => {
                  if (!isDragging || !previewRef.current) return;
                  const rect = previewRef.current.getBoundingClientRect();
                  handleDrag(e, rect);
                }}
                onMouseUp={() => {
                  setIsDragging(false);
                  stopDragging();
                }}
                onTouchStart={(e) => {
                  setIsDragging(true);
                  if (!previewRef.current || e.touches.length === 0) return;
    
                  const rect = previewRef.current.getBoundingClientRect();
                  const touch = e.touches[0];
                  
                  const relativeX = ((touch.clientX - rect.left) / rect.width * 2 - 1) * 100;
                  const relativeY = ((touch.clientY - rect.top) / rect.height * 2 - 1) * 100;
                  
                  if (activeLineIndex !== null) {
                    updateTextPosition(activeLineIndex, relativeX, relativeY);
                    startTextDrag(activeLineIndex);
                  } else if (design.includeLogo) {
                    updateLogoPosition(relativeX, relativeY);
                    startLogoDrag();
                  }
                }}
                onTouchMove={(e) => {
                  if (!isDragging || !previewRef.current) return;
                  const rect = previewRef.current.getBoundingClientRect();
                  handleDrag(e, rect);
                }}
                downloadAsPng={downloadAsPng}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomLevel={zoomLevel}
                background="paper"
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </div>
            
            {/* Product info and add to cart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Size: {product.size}</p>
                  <p className="text-sm text-gray-600">Ink Color: {design.inkColor}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">{product.price} DHS</span>
                  <p className="text-sm text-gray-600">TTC</p>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Main editing section */}
          <div className="p-6">
            {/* Show design step based on current step */}
            {currentStep === 'templates' && design.shape === 'circle' && (
              <ProfessionalCircularTemplates onApplyTemplate={applyTemplate} />
            )}

            {currentStep === 'logo' && (
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
            )}
            
            {currentStep === 'text' && (
              <>
                <TextLinesEditor
                  lines={design.lines}
                  product={product}
                  onUpdateLine={updateLine}
                  onAddLine={addLine}
                  onRemoveLine={removeLine}
                  onToggleCurvedText={toggleCurvedText}
                  globalAlignment={design.globalAlignment}
                  onGlobalAlignmentChange={setGlobalAlignment}
                />
                
                <AutoArrange 
                  design={design}
                  onEnhancedAutoArrange={enhancedAutoArrange}
                  shape={getCompatibleShape(design.shape)}
                />
              </>
            )}
            
            {currentStep === 'border' && (
              <BorderStyleSelector 
                borderStyle={design.borderStyle} 
                borderThickness={design.borderThickness}
                onBorderStyleChange={setBorderStyle}
                onBorderThicknessChange={setBorderThickness}
                largeControls={largeControls}
              />
            )}
            
            {currentStep === 'color' && (
              <ColorSelector 
                inkColors={product.inkColors} 
                selectedColor={design.inkColor} 
                onColorSelect={setInkColor}
              />
            )}
            
            {/* Step navigation buttons */}
            <div className="flex justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={currentStep === 'templates'}
                className={largeControls ? "text-lg py-3 px-5" : ""}
              >
                Previous
              </Button>
              
              <Button
                variant="default"
                onClick={goToNextStep}
                disabled={currentStep === 'preview'}
                className={`${largeControls ? "text-lg py-3 px-5" : ""} ${highContrast ? "bg-blue-800" : ""}`}
              >
                {currentStep === 'color' ? 'Preview' : 'Next'}
              </Button>
            </div>
          </div>
          
          {/* Large preview section below editing - now shows for all steps */}
          <div className="border-t bg-gray-50 p-8">
            <h3 className="text-lg font-semibold mb-6 text-center">Aperçu en temps réel</h3>
            
            {/* Larger preview container - increased size */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
                    <StampPreview
                      previewImage={previewImage}
                      productSize={product.size}
                      previewRef={previewRef}
                      isDragging={isDragging}
                      activeLineIndex={activeLineIndex}
                      includeLogo={design.includeLogo}
                      onMouseDown={(e) => {
                        setIsDragging(true);
                        handlePreviewClick(e);
                      }}
                      onMouseMove={(e) => {
                        if (!isDragging || !previewRef.current) return;
                        const rect = previewRef.current.getBoundingClientRect();
                        handleDrag(e, rect);
                      }}
                      onMouseUp={() => {
                        setIsDragging(false);
                        stopDragging();
                      }}
                      onTouchStart={(e) => {
                        setIsDragging(true);
                        if (!previewRef.current || e.touches.length === 0) return;
          
                        const rect = previewRef.current.getBoundingClientRect();
                        const touch = e.touches[0];
                        
                        const relativeX = ((touch.clientX - rect.left) / rect.width * 2 - 1) * 100;
                        const relativeY = ((touch.clientY - rect.top) / rect.height * 2 - 1) * 100;
                        
                        if (activeLineIndex !== null) {
                          updateTextPosition(activeLineIndex, relativeX, relativeY);
                          startTextDrag(activeLineIndex);
                        } else if (design.includeLogo) {
                          updateLogoPosition(relativeX, relativeY);
                          startLogoDrag();
                        }
                      }}
                      onTouchMove={(e) => {
                        if (!isDragging || !previewRef.current) return;
                        const rect = previewRef.current.getBoundingClientRect();
                        handleDrag(e, rect);
                      }}
                      downloadAsPng={downloadAsPng}
                      zoomLevel={zoomLevel}
                      onZoomIn={zoomIn}
                      onZoomOut={zoomOut}
                    />
                  </div>
                </div>
              </div>
              
              {/* Product info and add to cart */}
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <span className="font-bold text-xl text-brand-red">{product.price} DHS TTC</span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-4 bg-brand-red text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 ${largeControls ? "text-lg py-5" : "text-base"}`}
                >
                  <ShoppingCart size={largeControls ? 24 : 20} />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StampDesignerMain;
