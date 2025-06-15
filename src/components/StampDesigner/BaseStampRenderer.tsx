
import React from "react";
import { mmToPx } from "@/utils/dimensions";

export interface BaseStampRendererProps {
  widthMm: number;
  heightMm: number;
  highContrast?: boolean;
  zoomLevel?: number;
  background?: string;
  isAnimating?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // Optionally pass "productSize" or label for accessibility
  ariaLabel?: string;
}

/**
 * A shared layout renderer for all preview canvases.
 * Handles sizing, zoom, background and accessibility.
 */
const BaseStampRenderer: React.FC<BaseStampRendererProps> = ({
  widthMm,
  heightMm,
  highContrast = false,
  zoomLevel = 1,
  background = "none",
  isAnimating = false,
  className = "",
  style = {},
  children,
  ariaLabel,
}) => {
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  return (
    <div
      className={`relative mx-auto rounded-lg shadow-inner bg-white ${highContrast ? "border-2 border-black" : ""} ${className}`}
      style={{ width: widthPx, height: heightPx, background: background === "paper" ? "#faf8f2" : "#fff", ...style }}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transform: `scale(${(zoomLevel ?? 1).toFixed(3)})`,
          transformOrigin: "center center",
          transition: isAnimating ? "none" : "transform 0.3s cubic-bezier(.4,2,.6,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseStampRenderer;
