
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

  const handleShareDesign = async () => {
    if (navigator.share && previewImage) {
      try {
        // Convert the data URL to a file
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], `${productName.replace(/\s/g, '-')}-stamp-design.png`, { type: 'image/png' });

        await navigator.share({
          title: t('export.shareTitle', 'My Custom Stamp Design'),
          text: t('export.shareText', 'Check out my custom stamp design!'),
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing design:', error);
        // Fallback - open in new window
        if (previewImage) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
          }
        }
      }
    } else if (previewImage) {
      // Fallback for browsers that don't support the Web Share API
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
        {t('export.title', 'Export Design')}
      </h3>
      
      <p className={`text-sm text-gray-600 ${largeControls ? "text-base" : ""}`}>
        {t('export.description', 'Download or share your stamp design')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={downloadAsPng} 
          disabled={!previewImage}
          variant="outline"
          className={`flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
        >
          <Download size={largeControls ? 24 : 18} />
          {t('export.downloadImage', 'Download as Image')}
        </Button>
        
        {navigator.share && (
          <Button 
            onClick={handleShareDesign} 
            disabled={!previewImage}
            variant="outline"
            className={`flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
          >
            <Share size={largeControls ? 24 : 18} />
            {t('export.shareDesign', 'Share Design')}
          </Button>
        )}
      </div>
      
      {previewImage && (
        <div className="border rounded-md p-2 mt-2">
          <img 
            src={previewImage} 
            alt={t('export.stampDesign', 'Stamp design')}
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ExportDesign;
