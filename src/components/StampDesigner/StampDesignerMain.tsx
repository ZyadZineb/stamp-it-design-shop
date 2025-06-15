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

  const getCompatibleShape = (
    shape: "rectangle" | "circle" | "square" | "ellipse"
  ): "rectangle" | "circle" | "square" => {
    if (shape === "ellipse") return "rectangle";
    return shape;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
    addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
    
    if (onAddToCart) onAddToCart();
  };

  const handleLogoUpload = () => {
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  React.useEffect(() => {
    if (uploadedLogo) {
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const relativeX = ((clickX / rect.width) * 2 - 1) * 100;
    const relativeY = ((clickY / rect.height) * 2 - 1) * 100;
    
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    }
    else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    event.preventDefault();
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

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

  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
  };

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

  const goToNextStep = () => {
    if (currentStep === 'templates') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('color');
    else if (currentStep === 'color') setCurrentStep('preview');
  };

  const goToPrevStep = () => {
    if (currentStep === 'preview') setCurrentStep('color');
    else if (currentStep === 'color') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('templates');
  };

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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-sm">
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
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Créateur de Tampon Professionnel</h2>
            <p className="text-blue-700 font-medium">
              <span className="bg-blue-100 px-2 py-1 rounded-full text-sm">
                {product.name} • {product.size}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{product.price} DHS</div>
            <div className="text-sm text-gray-600">TTC</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between">
            {(['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).map((step, index) => {
              const stepInfo = getStepInfo(step);
              const isActive = currentStep === step;
              const isCompleted = (['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) > index;
              
              return (
                <div 
                  key={step}
                  className={`flex-1 text-center cursor-pointer transition-all duration-200 ${isActive ? 'transform scale-105' : ''}`}
                  onClick={() => setCurrentStep(step)}
                >
                  <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : isActive 
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}>
                    {isCompleted ? '✓' : stepInfo.icon}
                  </div>
                  <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {stepInfo.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {currentStep === 'preview' ? (
        <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white overflow-auto">
          <div className="h-full flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Aperçu Final</h2>
              <p className="text-gray-600">Votre tampon est prêt ! Vérifiez tous les détails avant de commander.</p>
            </div>
            
            <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 mb-6 min-h-0">
              <StampPreviewAccessible
                previewImage={previewImage}
                productSize={product.size}
                isDragging={isDragging}
                activeLineIndex={activeLineIndex}
                includeLogo={design.includeLogo}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                downloadAsPng={downloadAsPng}
                zoomLevel={zoomLevel}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                background="paper"
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </div>
            
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700"><span className="font-medium">Taille:</span> {product.size}</p>
                    <p className="text-gray-700">
                      <span className="font-medium">Couleur d'encre:</span> 
                      <span
                        className="inline-block w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: design.inkColor }}
                      ></span>
                      {design.inkColor}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{product.price} DHS</div>
                  <div className="text-sm text-gray-600">TTC, livraison incluse</div>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <ShoppingCart size={24} className="mr-2" />
                Ajouter au Panier
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 bg-gray-50 overflow-hidden">
            <div className="h-full">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 h-[calc(100%-120px)]">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{getStepInfo(currentStep).title}</h3>
                  <p className="text-gray-600">{getStepInfo(currentStep).description}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100%-80px)]">
                  <div className="xl:col-span-2 space-y-4 overflow-y-auto">
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
                  </div>

                  <div className="xl:col-span-1 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border overflow-hidden">
                    <h4 className="text-lg font-semibold mb-3 text-gray-900">Aperçu en Temps Réel</h4>
                    <div className="h-[calc(100%-40px)]">
                      <StampPreview
                        previewImage={previewImage}
                        productSize={product.size}
                        previewRef={previewRef}
                        isDragging={isDragging}
                        activeLineIndex={activeLineIndex}
                        includeLogo={design.includeLogo}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={onTouchMove}
                        downloadAsPng={downloadAsPng}
                        zoomLevel={zoomLevel}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
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
                  <div className="text-sm text-gray-500 mb-1">
                    Étape {(['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) + 1} sur 6
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(((['templates', 'logo', 'text', 'border', 'color', 'preview'] as StepType[]).indexOf(currentStep) + 1) / 6) * 100}%` 
                      }}
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
            </div>
          </div>
          
          <div className="flex-shrink-0 bg-gradient-to-r from-red-50 to-pink-50 border-t border-red-100 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm">Taille: {product.size} • Couleur: {design.inkColor}</p>
              </div>
              <div className="text-right mr-4">
                <span className="font-bold text-2xl text-red-600">{product.price} DHS</span>
                <p className="text-sm text-gray-600">TTC</p>
              </div>
              <Button
                onClick={handleAddToCart}
                className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Ajouter au Panier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default StampDesignerMain;
