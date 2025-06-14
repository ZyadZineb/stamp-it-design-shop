
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { Check, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface PreviewOnPaperProps {
  previewImage: string | null;
  productName: string;
  onAnimate?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const PreviewOnPaper: React.FC<PreviewOnPaperProps> = ({
  previewImage,
  productName,
  onAnimate,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSurface, setCurrentSurface] = useState<string>('white');
  const [previewZoom, setPreviewZoom] = useState(1);
  
  const surfaces = [
    { id: 'white', label: 'White Paper', color: 'bg-white' },
    { id: 'cream', label: 'Cream Paper', color: 'bg-amber-50' },
    { id: 'colored', label: 'Colored Paper', color: 'bg-blue-100' },
    { id: 'envelope', label: 'Envelope', color: 'bg-yellow-100' },
    { id: 'card', label: 'Business Card', color: 'bg-gray-100' },
  ];

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    if (onAnimate) onAnimate();
  };

  const getSurfaceStyle = () => {
    const surface = surfaces.find(s => s.id === currentSurface);
    return surface ? surface.color : 'bg-white';
  };

  const handleZoomIn = () => {
    setPreviewZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setPreviewZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${highContrast ? 'text-black' : 'text-gray-800'}`}>
          {t('preview.finalPreview', "Aperçu final de votre tampon")}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            variant="outline"
            size="sm"
            disabled={previewZoom <= 0.5}
          >
            <ZoomOut size={16} />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(previewZoom * 100)}%
          </span>
          <Button
            onClick={handleZoomIn}
            variant="outline"
            size="sm"
            disabled={previewZoom >= 3}
          >
            <ZoomIn size={16} />
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          {t('preview.description', 'Vérifiez que tous les éléments sont bien positionnés avant de commander. Vous pouvez tester l\'effet du tampon sur différentes surfaces.')}
        </p>
        
        {/* Surface Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {t('preview.selectSurface', 'Tester sur différentes surfaces:')}
          </label>
          <div className="flex flex-wrap gap-2">
            {surfaces.map(surface => (
              <button
                key={surface.id}
                onClick={() => setCurrentSurface(surface.id)}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  surface.id === currentSurface 
                    ? (highContrast ? 'bg-gray-800 text-white' : 'bg-brand-blue text-white') 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${largeControls ? 'text-base py-3 px-4' : ''}`}
              >
                {t(`preview.surface.${surface.id}`, surface.label)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Preview Area */}
      <div className={`rounded-lg p-8 shadow-inner ${getSurfaceStyle()} relative min-h-[400px] flex items-center justify-center`}>
        {previewImage ? (
          <div className={`flex justify-center items-center ${isAnimating ? 'animate-bounce' : ''}`}>
            <div 
              className="relative bg-white rounded-lg shadow-lg p-4" 
              style={{
                filter: isAnimating ? 'contrast(1.1) brightness(0.95)' : 'none',
                transform: `scale(${isAnimating ? 0.98 * previewZoom : previewZoom})`,
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <img 
                src={previewImage} 
                alt={t('preview.stampPreview', "Aperçu du tampon")}
                className="max-w-full h-auto block mx-auto"
                style={{
                  maxWidth: '600px',
                  maxHeight: '400px',
                  width: 'auto',
                  height: 'auto'
                }}
              />
              
              {/* Product Info Overlay */}
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 inline-block shadow-sm">
                  <span className="text-xs font-medium text-gray-600">
                    {productName}
                  </span>
                </div>
              </div>

              {/* Surface Texture Overlays */}
              {currentSurface === 'envelope' && (
                <div className="absolute inset-0 bg-[url('/lovable-uploads/53ca1f4f-4e7e-4879-ad4b-e665d96511fd.png')] bg-center bg-contain bg-no-repeat opacity-10 pointer-events-none"></div>
              )}
              {currentSurface === 'card' && (
                <div className="absolute inset-0 bg-[url('/lovable-uploads/4860f75e-9a1e-43c9-89b4-448b485c8af2.png')] bg-center bg-contain bg-no-repeat opacity-10 pointer-events-none"></div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-center">
              {t('preview.noPreview', "Aucun aperçu disponible")}
            </p>
            <p className="text-xs text-center mt-1">
              {t('preview.addContent', "Ajoutez du contenu à votre tampon pour voir l'aperçu")}
            </p>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <HelpTooltip content={t('preview.animateTooltip', "Voir comment votre tampon s'imprimera sur papier")}>
          <Button 
            onClick={handleAnimate} 
            disabled={!previewImage}
            variant="outline"
            size={largeControls ? "lg" : "default"}
            className={`flex-1 sm:flex-none ${largeControls ? 'text-lg py-4 px-6' : 'py-3 px-6'}`}
          >
            <Check className="mr-2" size={largeControls ? 20 : 16} />
            {t('preview.animate', "Simuler l'impression")}
          </Button>
        </HelpTooltip>

        {previewImage && (
          <Button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = previewImage;
              link.download = `${productName.replace(/\s/g, '-')}-preview.svg`;
              link.click();
            }}
            variant="outline"
            size={largeControls ? "lg" : "default"}
            className={`flex-1 sm:flex-none ${largeControls ? 'text-lg py-4 px-6' : 'py-3 px-6'}`}
          >
            <Download className="mr-2" size={largeControls ? 20 : 16} />
            {t('preview.download', "Télécharger l'aperçu")}
          </Button>
        )}
      </div>

      {/* Quality Check */}
      {previewImage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            {t('preview.qualityCheck', "Vérification qualité")}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-blue-800">
              <Check size={16} className="mr-2 text-green-600" />
              {t('preview.readabilityCheck', "Lisibilité du texte optimisée")}
            </div>
            <div className="flex items-center text-sm text-blue-800">
              <Check size={16} className="mr-2 text-green-600" />
              {t('preview.sizeCheck', "Dimensions respectées")}
            </div>
            <div className="flex items-center text-sm text-blue-800">
              <Check size={16} className="mr-2 text-green-600" />
              {t('preview.centeringCheck', "Centrage automatique appliqué")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewOnPaper;
