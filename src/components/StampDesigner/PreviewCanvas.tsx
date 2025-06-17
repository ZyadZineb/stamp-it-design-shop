import React, { useState } from "react";
import { mmToPx } from "@/utils/dimensions";
import { Download, ZoomIn, ZoomOut, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/tooltip-custom";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [showGrid, setShowGrid] = useState(false);
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
          stroke="#e0f2fe"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
          opacity={i % 5 === 0 ? 0.4 : 0.2}
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
          stroke="#e0f2fe"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
          opacity={i % 5 === 0 ? 0.4 : 0.2}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 pt-4 gap-3">
        <h3 className={`font-medium ${highContrast ? "text-black" : "text-gray-800"} text-lg`}>
          {t("preview.title", "Preview")}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Grid toggle */}
          <div className="flex items-center gap-2 mr-4">
            <Switch
              id="grid-toggle"
              checked={showGrid}
              onCheckedChange={setShowGrid}
              aria-describedby="grid-toggle-description"
            />
            <Label htmlFor="grid-toggle" className="text-sm flex items-center gap-1 cursor-pointer">
              <Grid size={14} />
              {t("preview.grid", "Grid")}
            </Label>
            <span id="grid-toggle-description" className="sr-only">
              {t("preview.gridDescription", "Toggle measurement grid overlay")}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <HelpTooltip content={t("preview.zoomHelp", "Zoom in or out to see more detail")}>
              <Button 
                variant="outline" 
                size={largeControls ? "default" : "icon"} 
                onClick={onZoomOut} 
                disabled={!onZoomOut || zoomLevel <= 1} 
                className={`min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 ${largeControls ? "h-12 w-12 p-0" : ""}`}
                aria-label={t("preview.zoomOut", "Zoom out")}
              >
                <ZoomOut size={largeControls ? 20 : 16} />
              </Button>
            </HelpTooltip>
            
            <span className="text-sm w-16 text-center font-mono bg-gray-50 rounded px-2 py-1">
              {`${Math.round((zoomLevel || 1) * 100)}%`}
            </span>
            
            <HelpTooltip content={t("preview.zoomHelp", "Zoom in or out to see more detail")}>
              <Button 
                variant="outline" 
                size={largeControls ? "default" : "icon"} 
                onClick={onZoomIn} 
                disabled={!onZoomIn || zoomLevel >= 3} 
                className={`min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 ${largeControls ? "h-12 w-12 p-0" : ""}`}
                aria-label={t("preview.zoomIn", "Zoom in")}
              >
                <ZoomIn size={largeControls ? 20 : 16} />
              </Button>
            </HelpTooltip>
          </div>

          {/* Download button */}
          <HelpTooltip content={t("preview.downloadHelp", "Download your stamp design as a high-quality PNG image")}>
            <Button 
              variant="outline" 
              size={largeControls ? "default" : "icon"} 
              onClick={downloadAsPng} 
              disabled={!downloadAsPng || !previewImage} 
              className={`min-h-[44px] min-w-[44px] hover:bg-green-50 focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 ${largeControls ? "h-12 w-12 p-0" : ""}`}
              aria-label={t("preview.download", "Download stamp design")}
            >
              <Download size={largeControls ? 20 : 16} />
            </Button>
          </HelpTooltip>
        </div>
      </div>
      {/* Preview canvas area */}
      <div
        className="relative select-none mt-4 mx-auto"
        style={{
          width: widthPx,
          height: heightPx,
          background: background === 'paper' ? "#faf8f2" : "#fff",
          touchAction: "none",
          cursor: getCursorStyle(),
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
        role="button"
        aria-label={t("preview.ariaLabel", "Stamp preview area - click and drag to position elements")}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onTouchStart={onCanvasTouchStart}
        onTouchMove={onCanvasTouchMove}
        onTouchEnd={onCanvasTouchEnd}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Handle keyboard interaction if needed
          }
        }}
      >
        {/* Grid overlay */}
        {(showGrid || debugConfig?.grid) && renderGrid()}
        
        {/* Debug overlays */}
        {debugConfig?.rulers && (
          <svg
            width={widthPx}
            height={heightPx}
            className="absolute z-40 inset-0 pointer-events-none"
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
        )}
        {debugConfig?.boundingBoxes && (
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
        )}
        {debugConfig?.baseline && (
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
        )}

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
            <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-gray-50/50 rounded">
              <div className="text-6xl mb-4 text-gray-300">📄</div>
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                {t("preview.yourStampHere", "Your stamp will appear here")}
              </h4>
              <p className="text-sm text-gray-500 max-w-xs">
                {t("preview.addTextHelp", "Add text and customize your design to see the preview")}
              </p>
            </div>
          )}
        </div>
        
        {/* Focus/Drop guides */}
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none bg-blue-200/10 border-2 border-dashed border-blue-400 z-50 animate-pulse" />
        )}
      </div>
      
      {/* Footer info */}
      <div className="text-xs text-gray-500 flex flex-col sm:flex-row justify-between mt-3 px-4 pb-4 gap-1">
        <span>{productSize && `${t("preview.size", "Size")}: ${productSize}`}</span>
        <span>
          {activeLineIndex !== null
            ? t("preview.editingLine", { line: activeLineIndex + 1 }, "Editing line {{line}}")
            : includeLogo
            ? t("preview.editingLogo", "Editing logo")
            : t("preview.clickToEdit", "Click elements to edit")}
        </span>
      </div>
    </div>
  );
};

export default PreviewCanvas;
