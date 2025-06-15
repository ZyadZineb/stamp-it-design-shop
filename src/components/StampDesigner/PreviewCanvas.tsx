import React, { useState } from "react";
import { mmToPx } from "@/utils/dimensions";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/tooltip-custom";
import { useTranslation } from "react-i18next";

/** NEW: Debug settings type */
export interface DebugOverlaySettings {
  grid?: boolean;
  rulers?: boolean;
  boundingBoxes?: boolean;
  baseline?: boolean;
}

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
  /** NEW: Debug mode and overlays config */
  debug?: boolean | DebugOverlaySettings;
  /** For rendering bounding boxes/baseline: optional design data can be added for future extension */
  textBlocks?: {
    x: number;
    y: number;
    width: number;
    height: number;
    baseline: number;
    key: string;
  }[];
  lines?: string[]; // For future baseline visual, if needed
}

const defaultDebug: DebugOverlaySettings = {
  grid: true,
  rulers: true,
  boundingBoxes: true,
  baseline: true,
};

/**
 * Canonical, mm-accurate, interactive preview canvas for the stamp designer.
 * INCLUDES: Debug overlays for dev/designer mm-precise validation.
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
  onCanvasTouchEnd,
  // Debug props
  debug,
  textBlocks = [],
  lines = [],
}) => {
  const { t } = useTranslation();
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  // Debug mode: decide which overlays enabled
  let debugConfig: DebugOverlaySettings | null = null;
  if (debug) {
    if (typeof debug === "boolean") debugConfig = defaultDebug;
    else debugConfig = { ...defaultDebug, ...debug };
  }

  // Helpers for overlay rendering
  /** mm grid rendered as SVG lines every 10px (=1mm) */
  const renderGrid = () => (
    <svg width={widthPx} height={heightPx} className="absolute z-30 inset-0 pointer-events-none">
      {/* Vertical lines */}
      {Array.from({ length: Math.ceil(widthPx / 10) }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 10}
          x2={i * 10}
          y1={0}
          y2={heightPx}
          stroke="#b3e1ff"
          strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
          opacity={i % 5 === 0 ? 0.32 : 0.17}
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: Math.ceil(heightPx / 10) }, (_, i) => (
        <line
          key={`h${i}`}
          y1={i * 10}
          y2={i * 10}
          x1={0}
          x2={widthPx}
          stroke="#b3e1ff"
          strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
          opacity={i % 5 === 0 ? 0.32 : 0.17}
        />
      ))}
    </svg>
  );

  /** mm rulers: SVG at top and left, with labels every 5mm */
  const renderRulers = () => (
    <svg
      width={widthPx}
      height={heightPx}
      className="absolute z-40 inset-0 pointer-events-none"
      style={{}}
    >
      {/* Top ruler */}
      {Array.from({ length: Math.ceil(widthMm) + 1 }, (_, i) => (
        <g key={`rx${i}`}>
          <line
            x1={i * 10}
            y1={0}
            x2={i * 10}
            y2={10}
            stroke="#3182ce"
            strokeWidth={i % 5 === 0 ? 1.1 : 0.75}
          />
          {i % 5 === 0 && (
            <text
              x={i * 10 + 2}
              y={18}
              fontSize={7}
              fill="#1973aa"
              fontFamily="monospace"
            >
              {i}
            </text>
          )}
        </g>
      ))}
      {/* Left ruler */}
      {Array.from({ length: Math.ceil(heightMm) + 1 }, (_, i) => (
        <g key={`ry${i}`}>
          <line
            x1={0}
            y1={i * 10}
            x2={10}
            y2={i * 10}
            stroke="#3182ce"
            strokeWidth={i % 5 === 0 ? 1.1 : 0.75}
          />
          {i % 5 === 0 && (
            <text
              x={13}
              y={i * 10 + 8}
              fontSize={7}
              fill="#1973aa"
              fontFamily="monospace"
            >
              {i}
            </text>
          )}
        </g>
      ))}
    </svg>
  );

  /** Outline each text block: dashed box, label with key */
  const renderBoundingBoxes = () => (
    <svg width={widthPx} height={heightPx} className="absolute z-50 inset-0 pointer-events-none">
      {textBlocks.map(({ x, y, width, height, key }, i) => (
        <g key={key ?? i}>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            stroke="#ec4899"
            strokeWidth={2}
            fill="none"
            strokeDasharray="5 4"
            opacity={0.75}
          />
          <text
            x={x + 3}
            y={y + 11}
            fontSize={11}
            fill="#f63fa2"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {key}
          </text>
        </g>
      ))}
    </svg>
  );

  /** Baseline guides for text blocks (horizontal line per block baseline) */
  const renderBaselines = () => (
    <svg width={widthPx} height={heightPx} className="absolute z-50 inset-0 pointer-events-none">
      {textBlocks.map(({ x, baseline, width, key }, i) => (
        <line
          key={key + "-base"}
          x1={x}
          y1={baseline}
          x2={x + width}
          y2={baseline}
          stroke="#3b82f6"
          strokeWidth={1.4}
          strokeDasharray="4 4"
          opacity={0.8}
        />
      ))}
    </svg>
  );

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
        {/* Debug overlays */}
        {debugConfig?.grid && renderGrid()}
        {debugConfig?.rulers && renderRulers()}
        {debugConfig?.boundingBoxes && renderBoundingBoxes()}
        {debugConfig?.baseline && renderBaselines()}

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
