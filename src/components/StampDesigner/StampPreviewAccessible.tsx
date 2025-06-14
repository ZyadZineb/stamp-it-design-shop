import React from 'react';
import { useTranslation } from 'react-i18next';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
interface StampPreviewAccessibleProps {
  previewImage: string | null;
  productSize: string;
  isDragging?: boolean;
  activeLineIndex?: number | null;
  includeLogo?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng?: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomLevel?: number;
  background?: string;
  highContrast?: boolean;
  largeControls?: boolean;
  isAnimating?: boolean;
}
const StampPreviewAccessible: React.FC<StampPreviewAccessibleProps> = ({
  previewImage,
  productSize,
  isDragging = false,
  activeLineIndex = null,
  includeLogo = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel = 1,
  background = 'none',
  highContrast = false,
  largeControls = false,
  isAnimating = false
}) => {
  const {
    t
  } = useTranslation();

  // Determine the cursor style based on active elements
  const getCursorStyle = () => {
    if (isDragging) return 'grabbing';
    if (activeLineIndex !== null || includeLogo) return 'grab';
    return 'default';
  };

  // Get background style based on selected background
  const getBackgroundStyle = () => {
    switch (background) {
      case 'grid':
        return 'bg-gray-50 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]';
      case 'dots':
        return 'bg-[radial-gradient(#d0d0d0_1px,transparent_1px)] bg-[size:20px_20px]';
      case 'paper':
        return 'bg-amber-50';
      case 'dark':
        return 'bg-gray-800';
      default:
        return 'bg-white';
    }
  };

  // Instructions text based on context
  const getInstructionText = () => {
    if (activeLineIndex !== null) {
      return t('preview.instructionDragText', "Click and drag to position the text");
    } else if (includeLogo) {
      return t('preview.instructionDragLogo', "Click and drag to position the logo");
    } else {
      return t('preview.instructionGeneral', "Select text or logo to position elements");
    }
  };

  // Calculate stamp dimensions from the product size (e.g., "60x40")
  const getSizeDimensions = () => {
    const dimensions = productSize.split('x');
    if (dimensions.length === 2) {
      return {
        width: parseInt(dimensions[0], 10),
        height: parseInt(dimensions[1], 10)
      };
    }
    return {
      width: 60,
      height: 40
    }; // Default dimensions
  };
  const {
    width,
    height
  } = getSizeDimensions();
  return <div className="-bottom-0 ">
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-medium ${highContrast ? 'text-black' : 'text-gray-800'}`}>
          {t('preview.title', "Preview")}
        </h3>
        <div className="flex items-center gap-2">
          <HelpTooltip content={t('preview.zoomHelp', "Zoom in or out to see more detail")}>
            <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={zoomOut} disabled={!zoomOut || zoomLevel <= 1} title={t('preview.zoomOut', "Zoom out")} className={largeControls ? "h-10 w-10 p-0" : ""}>
              <ZoomOut size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
          
          <span className="text-sm w-16 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <HelpTooltip content={t('preview.zoomHelp', "Zoom in or out to see more detail")}>
            <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={zoomIn} disabled={!zoomIn || zoomLevel >= 3} title={t('preview.zoomIn', "Zoom in")} className={largeControls ? "h-10 w-10 p-0" : ""}>
              <ZoomIn size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
          
          {downloadAsPng && <HelpTooltip content={t('preview.downloadHelp', "Download your stamp design as a high-quality PNG image")}>
              <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={downloadAsPng} disabled={!previewImage} title={t('preview.download', "Download")} className={largeControls ? "h-10 w-10 p-0" : ""}>
                <Download size={largeControls ? 20 : 16} />
              </Button>
            </HelpTooltip>}
        </div>
      </div>
      
      <div style={{
      minHeight: '300px',
      cursor: getCursorStyle(),
      aspectRatio: width && height ? `${width}/${height}` : '3/2'
    }} role="button" aria-label={getInstructionText()} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp ? e => {
      // Convert TouchEvent to expected format for the onMouseUp handler
      onMouseUp(e as unknown as React.MouseEvent<HTMLDivElement>);
    } : undefined} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMouseUp ? e => {
      // Convert TouchEvent to expected format for the onMouseUp handler
      onMouseUp(e as unknown as React.MouseEvent<HTMLDivElement>);
    } : undefined} tabIndex={0} className="mx-10 bg-zinc-50 rounded-full">
        {previewImage ? <div style={{
        transform: `scale(${zoomLevel})`,
        transition: isAnimating ? 'all 0.3s ease-out' : 'transform 0.3s ease-out'
      }} className="mx-0 rounded-br-full ">
            <img src={previewImage} alt={t('preview.stampDesign', "Stamp design")} className="-bottom-0 object-scale-down " />
          </div> : <div className="text-gray-400 text-center">
            {t('preview.noPreviewAvailable', "No preview available yet")}
          </div>}
        
        {isAnimating && <div className="absolute inset-0 bg-black opacity-5"></div>}
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        {getInstructionText()}
      </p>
      
      <div className="text-xs text-gray-400 flex justify-between mt-1">
        <span>
          {t('preview.size', "Size")}: {productSize}mm
        </span>
        <span>
          {activeLineIndex !== null ? t('preview.editingLine', "Editing line {{line}}", {
          line: activeLineIndex + 1
        }) : includeLogo ? t('preview.editingLogo', "Editing logo") : ''}
        </span>
      </div>
    </div>;
};
export default StampPreviewAccessible;