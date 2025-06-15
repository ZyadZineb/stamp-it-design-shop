
import React from "react";
import { mmToPx } from "@/utils/dimensions";

interface PreviewCanvasProps {
  widthMm: number;
  heightMm: number;
  children: React.ReactNode;
  showRuler?: boolean;
  showBaselineBox?: boolean;
  className?: string;
}

/**
 * Renders a pixel-perfect, mm-accurate preview canvas
 * with optional ruler and bounding/center guides.
 */
const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  widthMm,
  heightMm,
  children,
  showRuler = false,
  showBaselineBox = false,
  className = "",
}) => {
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  return (
    <div
      className={`relative bg-white shadow-inner ${className}`}
      style={{
        width: widthPx,
        height: heightPx,
        boxSizing: "content-box",
        overflow: "hidden",
      }}
      data-testid="preview-canvas-root"
    >
      {showRuler && (
        <svg
          width={widthPx}
          height={heightPx}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: 0.4 }}
        >
          {/* Light grid every 5mm, bold every 10mm */}
          {Array.from({ length: Math.floor(widthMm / 5) + 1 }).map((_, i) => (
            <line
              key={`vx-${i}`}
              x1={i * mmToPx(5)}
              y1={0}
              x2={i * mmToPx(5)}
              y2={heightPx}
              stroke={i % 2 === 0 ? "#aaa" : "#eee"}
              strokeWidth={i % 2 === 0 ? 1 : 0.5}
            />
          ))}
          {Array.from({ length: Math.floor(heightMm / 5) + 1 }).map((_, i) => (
            <line
              key={`hy-${i}`}
              x1={0}
              y1={i * mmToPx(5)}
              x2={widthPx}
              y2={i * mmToPx(5)}
              stroke={i % 2 === 0 ? "#aaa" : "#eee"}
              strokeWidth={i % 2 === 0 ? 1 : 0.5}
            />
          ))}
        </svg>
      )}
      {showBaselineBox && (
        <div
          className="absolute border border-dashed border-blue-400 z-20"
          style={{
            top: 0,
            left: 0,
            width: widthPx,
            height: heightPx,
            pointerEvents: "none",
          }}
        />
      )}
      {/* Render stamp content */}
      <div className="relative w-full h-full z-30">{children}</div>
    </div>
  );
};

export default PreviewCanvas;
