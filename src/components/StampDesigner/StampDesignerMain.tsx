
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

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

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
  const [currentStep, setCurrentStep] = useState<StepType>('templates');

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

  // Get step information for better UI
  const getStepInfo = (step: StepType) => {
    const steps = {
      templates: { title: 'Modèles', description: 'Choisissez un modèle professionnel', icon: '📋' },
      logo: { title: 'Logo', description: 'Ajoutez votre logo d\'entreprise', icon: '🖼️' },
      text: { title: 'Texte', description: 'Personnalisez votre contenu textuel', icon: '✏️' },
      border: { title: 'Forme', description: 'Définissez les bordures et la forme', icon: '⬜' },
      color: { title: 'Couleur', description: 'Sélectionnez la couleur d\'encre', icon: '🎨' },
      preview: { title: 'Aperçu', description: 'Vérifiez le rendu final', icon: '👁️' }
    };
    return steps[step];
  };

  if (!product) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏷️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun produit sélectionné</h3>
          <p className="text-gray-600">Veuillez sélectionner un produit pour commencer à créer votre tampon professionnel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full min-h-screen">
      {/* Enhanced Header with better visual hierarchy */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Créateur de Tampon Professionnel</h2>
            <p className="text-blue-700 font-medium mt-1">
              <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                {product.name} • {product.size}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{product.price} DHS</div>
            <div className="text-sm text-gray-600">TTC</div>
          </div>
        </div>
        
        {/* Enhanced Progress Steps with better design */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {(['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).map((step, index) => {
              const stepInfo = getStepInfo(step);
              const isActive = currentStep === step;
              const isCompleted = (['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) > index;
              
              return (
                <div 
                  key={step}
                  className={`flex-1 text-center cursor-pointer transition-all duration-200 ${
                    isActive ? 'transform scale-105' : ''
                  }`}
                  onClick={() => setCurrentStep(step)}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : isActive 
                      ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                    {isCompleted ? '✓' : stepInfo.icon}
                  </div>
                  <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {stepInfo.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {stepInfo.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Layout changes for preview step to show clean design */}
      {currentStep === 'preview' ? (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen w-full">
          <div className="w-full max-w-none">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Aperçu Final</h2>
              <p className="text-lg text-gray-600">Votre tampon est prêt ! Vérifiez tous les détails avant de commander.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-10 mb-8 w-full">
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
            
            {/* Enhanced Product Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700"><span className="font-medium">Taille:</span> {product.size}</p>
                    <p className="text-gray-700"><span className="font-medium">Couleur d'encre:</span> <span className="inline-block w-4 h-4 rounded-full ml-2" style={{ backgroundColor: design.inkColor }}></span> {design.inkColor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600 mb-1">{product.price} DHS</div>
                  <div className="text-sm text-gray-600">TTC, livraison incluse</div>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <ShoppingCart size={28} className="mr-3" />
                Ajouter au Panier
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen w-full">
          {/* Enhanced Main editing section - Full width layout */}
          <div className="p-8 bg-gray-50 w-full">
            <div className="w-full">
              {/* Step Content with improved styling */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 w-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{getStepInfo(currentStep).title}</h3>
                  <p className="text-gray-600">{getStepInfo(currentStep).description}</p>
                </div>

                {/* Two column layout for better use of space */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left column: Controls */}
                  <div className="space-y-6">
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
                      <div className="space-y-6">
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
                      </div>
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
                  </div>

                  {/* Right column: Large Preview */}
                  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">Aperçu en Temps Réel</h4>
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
              
              {/* Enhanced Step navigation buttons */}
              <div className="flex justify-between items-center w-full">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  disabled={currentStep === 'templates'}
                  className={`${largeControls ? "text-lg py-4 px-8" : "py-3 px-6"} rounded-xl border-2 transition-all duration-200 ${
                    currentStep === 'templates' ? 'opacity-50' : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  ← Précédent
                </Button>
                
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Étape {(['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) + 1} sur 6</div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(((['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) + 1) / 6) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button
                  variant="default"
                  onClick={goToNextStep}
                  disabled={currentStep === 'preview'}
                  className={`${largeControls ? "text-lg py-4 px-8" : "py-3 px-6"} rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
                    currentStep === 'preview' ? 'opacity-50' : 'hover:scale-[1.02] shadow-lg'
                  }`}
                >
                  {currentStep === 'color' ? 'Aperçu' : 'Suivant'} →
                </Button>
              </div>
              
              {/* Enhanced Product info and add to cart - Full width */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl p-8 shadow-lg mt-8 w-full">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-600">Taille: {product.size} • Couleur: {design.inkColor}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-3xl text-red-600">{product.price} DHS</span>
                    <p className="text-sm text-gray-600">TTC</p>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-4 ${largeControls ? "text-xl py-8" : "text-lg"}`}
                >
                  <ShoppingCart size={largeControls ? 32 : 28} />
                  Ajouter au Panier
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
