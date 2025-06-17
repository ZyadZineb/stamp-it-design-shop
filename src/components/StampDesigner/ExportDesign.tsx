import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share, Play, Info } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import LoadingButton from './LoadingButton';

interface ExportDesignProps {
  svgRef: string | null;
  previewImage: string | null;
  productName: string;
  downloadAsPng: () => void;
  largeControls?: boolean;
}

const ExportDesign: React.FC<ExportDesignProps> = ({ 
  svgRef, 
  previewImage, 
  productName, 
  downloadAsPng,
  largeControls = false 
}) => {
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareDesign = async () => {
    if (navigator.share && previewImage) {
      setIsSharing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
        
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], `${productName.replace(/\s/g, '-')}-stamp-design.png`, { type: 'image/png' });

        await navigator.share({
          title: t('export.shareTitle', 'My Professional Stamp Design'),
          text: t('export.shareText', 'Check out my professional stamp design!'),
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing design:', error);
        if (previewImage) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
          }
        }
      } finally {
        setIsSharing(false);
      }
    } else if (previewImage) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing
      downloadAsPng();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleVirtualStamping = () => {
    setShowAnimation(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h3 className={`font-medium text-brand-blue ${largeControls ? "text-lg" : ""}`}>
          {t('export.title', 'Export Design')}
        </h3>
        <HelpTooltip content={t('export.sizeInfo', 'Downloads as transparent PNG at actual stamp size (380×140px for 38×14mm)')}>
          <Info size={16} className="text-gray-400" />
        </HelpTooltip>
      </div>
      
      <p className={`text-sm text-gray-600 ${largeControls ? "text-base" : ""}`}>
        {t('export.description', 'Download or share your professional stamp design')}
      </p>
      
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <HelpTooltip content={t('export.downloadTooltip', 'Download as high-quality PNG with transparent background')}>
            <LoadingButton 
              onClick={handleDownload}
              loading={isDownloading}
              loadingText="Downloading..."
              disabled={!previewImage}
              variant="outline"
              className={`flex items-center gap-2 min-h-[44px] hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-blue ${largeControls ? "text-lg py-6" : ""}`}
            >
              <Download size={largeControls ? 24 : 18} />
              {t('export.downloadImage', 'Download PNG')}
            </LoadingButton>
          </HelpTooltip>
          
          {navigator.share && (
            <HelpTooltip content={t('export.shareTooltip', 'Share your design with others')}>
              <LoadingButton 
                onClick={handleShareDesign}
                loading={isSharing}
                loadingText="Sharing..."
                disabled={!previewImage}
                variant="outline"
                className={`flex items-center gap-2 min-h-[44px] hover:bg-brand-blue hover:text-white border-brand-blue text-brand-blue focus-visible:outline-2 focus-visible:outline-brand-blue ${largeControls ? "text-lg py-6" : ""}`}
              >
                <Share size={largeControls ? 24 : 18} />
                {t('export.shareDesign', 'Share Design')}
              </LoadingButton>
            </HelpTooltip>
          )}

          <HelpTooltip content={t('export.simulationTooltip', 'See how your stamp will look when pressed on paper')}>
            <LoadingButton
              onClick={handleVirtualStamping}
              disabled={!previewImage}
              variant="outline"
              className={`flex items-center gap-2 min-h-[44px] hover:bg-green-600 hover:text-white border-green-600 text-green-600 focus-visible:outline-2 focus-visible:outline-green-600 ${largeControls ? "text-lg py-6" : ""}`}
            >
              <Play size={largeControls ? 24 : 18} />
              {t('export.printSimulation', 'Print Simulation')}
            </LoadingButton>
          </HelpTooltip>
        </div>
      </div>
      
      {previewImage && !showAnimation && (
        <div className="border rounded-md p-2 mt-2 bg-gray-50">
          <img 
            src={previewImage} 
            alt={t('export.stampDesign', 'Stamp design')}
            className="max-w-full h-auto mx-auto"
          />
          <p className="text-xs text-center text-gray-500 mt-2">
            {t('export.actualSize', 'Actual size preview - exported PNG will be high resolution')}
          </p>
        </div>
      )}

      {previewImage && showAnimation && (
        <div className="border rounded-md p-2 mt-2 bg-amber-50">
          <div className="relative">
            <div className={`transition-all duration-500`}>
              <img 
                src={previewImage} 
                alt={t('export.stampDesign', 'Stamp design')}
                className="max-w-full h-auto mx-auto"
                style={{
                  filter: isAnimating ? 'contrast(1.05) brightness(0.95)' : 'none',
                  transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
                }}
              />
            </div>
            {isAnimating && (
              <div 
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg border">
                  <p className="text-sm font-medium text-gray-800">
                    {t('export.printing', 'Printing on paper...')}
                  </p>
                </div>
              </div>
            )}
            {!isAnimating && showAnimation && (
              <div className="absolute bottom-2 right-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleVirtualStamping} 
                  className="bg-white min-h-[36px]"
                >
                  {t('export.viewAgain', 'Print Again')}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600 border-t pt-2">
            <p className="text-center">
              {isAnimating 
                ? t('export.simulatingPrint', 'Simulating stamp impression...')
                : t('export.printResult', 'This is how your stamp will appear when pressed on paper')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDesign;
