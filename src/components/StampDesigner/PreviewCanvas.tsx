import React, { useRef, useState } from "react";
import { mmToPx } from "@/utils/dimensions";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/tooltip-custom";
import { useTranslation } from "react-i18next";

export interface PreviewCanvasProps {
  previewImage: string | null;
  widthMm: number;
  heightMm: number;
  productSize?: string;
  highContrast?: boolean;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  downloadAsPng?: () => void;
  isDragging?: boolean;
  activeLineIndex?: number | null;
  includeLogo?: boolean;
  background?: string;
  largeControls?: boolean;
  isAnimating?: boolean;
  onCanvasMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onCanvasTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onCanvasTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void;
}

/**
 * Canonical, mm-accurate, interactive preview canvas for the stamp designer.
 */
const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  previewImage,
  widthMm,
  heightMm,
  productSize,
  highContrast = false,
  zoomLevel = 1,
  onZoomIn,
  onZoomOut,
  downloadAsPng,
  isDragging = false,
  activeLineIndex = null,
  includeLogo = false,
  background = 'none',
  largeControls = false,
  isAnimating = false,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasTouchStart,
  onCanvasTouchMove,
  onCanvasTouchEnd
}) => {
  const { t } = useTranslation();
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  // Logging for debug: preview size and center
  React.useEffect(() => {
    console.log(
      "[PreviewCanvas] pxSize:",
      { widthPx, heightPx },
      "Center:",
      { x: widthPx / 2, y: heightPx / 2 }
    );
  }, [widthPx, heightPx]);

  // Determine the cursor style based on state
  const getCursorStyle = () => {
    if (isDragging) return "grabbing";
    if (activeLineIndex !== null || includeLogo) return "grab";
    return "default";
  };

  return (
    <div className={`relative mx-auto rounded-lg shadow-inner bg-white ${highContrast ? "border-2 border-black" : ""}`}>
      {/* Top controls */}
      <div className="flex justify-between items-center px-2 pt-2">
        <h3 className={`font-medium ${highContrast ? "text-black" : "text-gray-800"} text-sm`}>
          {t("preview.title", "Preview")}
        </h3>
        <div className="flex items-center gap-2">
          <HelpTooltip content={t("preview.zoomHelp", "Zoom in or out to see more detail")}>
            <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={onZoomOut} disabled={!onZoomOut || zoomLevel <= 1} className={largeControls ? "h-10 w-10 p-0" : ""}>
              <ZoomOut size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
          <span className="text-sm w-12 text-center">
            {`${Math.round((zoomLevel || 1) * 100)}%`}
          </span>
          <HelpTooltip content={t("preview.zoomHelp", "Zoom in or out to see more detail")}>
            <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={onZoomIn} disabled={!onZoomIn || zoomLevel >= 3} className={largeControls ? "h-10 w-10 p-0" : ""}>
              <ZoomIn size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
          <HelpTooltip content={t("preview.downloadHelp", "Download your stamp design as a high-quality PNG image")}>
            <Button variant="outline" size={largeControls ? "default" : "icon"} onClick={downloadAsPng} disabled={!downloadAsPng || !previewImage} title={t("preview.download", "Download")} className={largeControls ? "h-10 w-10 p-0" : ""}>
              <Download size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
        </div>
      </div>
      {/* Preview canvas area */}
      <div
        className="relative select-none mt-2 mx-auto"
        style={{
          width: widthPx,
          height: heightPx,
          background: background === 'paper' ? "#faf8f2" : "#fff",
          touchAction: "none",
          cursor: getCursorStyle(),
          boxShadow: "0 2px 8px #0001"
        }}
        role="button"
        aria-label={t("preview.ariaLabel", "Stamp preview area")}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onTouchStart={onCanvasTouchStart}
        onTouchMove={onCanvasTouchMove}
        onTouchEnd={onCanvasTouchEnd}
        tabIndex={0}
      >
        {/* Clean SVG overlay (no grid/rulers/center point) */}
        <svg width={widthPx} height={heightPx} className="absolute z-20 inset-0 pointer-events-none">
          {/* No overlays */}
        </svg>
        <div className="relative w-full h-full z-30" style={{
          transform: `scale(${zoomLevel?.toFixed(3)})`,
          transformOrigin: "center center",
          transition: isAnimating ? "none" : "transform 0.3s cubic-bezier(.4,2,.6,1)"
        }}>
          {previewImage ? (
            <img
              src={previewImage}
              alt={t("preview.stampDesign", "Stamp design")}
              className="object-contain w-full h-full"
              style={{
                imageRendering: "auto"
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gray-400 text-center">
                {t("preview.noPreview", "No preview available")}
              </span>
            </div>
          )}
        </div>
        {/* Focus/Drop guides */}
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none bg-blue-200/10 border-2 border-dashed border-blue-400 z-50" />
        )}
      </div>
      {/* Footer info */}
      <div className="text-xs text-gray-500 flex justify-between mt-1">
        <span>{productSize && `${t("preview.size", "Size")}: ${productSize}mm`}</span>
        <span>
          {activeLineIndex !== null
            ? t("preview.editingLine", { line: activeLineIndex + 1 })
            : includeLogo
            ? t("preview.editingLogo", "Editing logo")
            : ""}
        </span>
      </div>
    </div>
  );
};

export default PreviewCanvas;
