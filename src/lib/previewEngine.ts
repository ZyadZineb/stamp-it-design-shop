
/**
 * Core logic for preview layout: alignment, spacing, and line heights.
 * Used by all stamp preview renderers.
 */

export type Align = "left" | "center" | "right";

export interface LayoutOptions {
  canvasWidth: number;
  canvasHeight: number;
  alignment?: Align;
  lineHeightMultiplier?: number;
  margin?: number;
}

export function calcLineHeight(fontSize: number, multiplier = 1.2) {
  return fontSize * multiplier;
}

export function calcMultiLineGroupBounds(
  lines: { text: string; fontSize: number }[],
  lineHeightMultiplier = 1.2
) {
  let totalHeight = 0;
  let maxWidth = 0;
  lines.forEach(({ text, fontSize }) => {
    const width = text.length * fontSize * 0.6; // basic width est.
    if (width > maxWidth) maxWidth = width;
    totalHeight += calcLineHeight(fontSize, lineHeightMultiplier);
  });
  return { width: maxWidth, height: totalHeight };
}

export function calcAlignedX(
  textWidth: number,
  canvasWidth: number,
  alignment: Align = "center",
  margin = 0
) {
  switch (alignment) {
    case "left":
      return margin;
    case "right":
      return canvasWidth - textWidth - margin;
    case "center":
    default:
      return (canvasWidth - textWidth) / 2;
  }
}

export function calcCenteredY(
  elementHeight: number,
  canvasHeight: number,
) {
  return (canvasHeight - elementHeight) / 2;
}

