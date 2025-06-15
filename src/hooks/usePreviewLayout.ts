
import { mmToPx } from "@/utils/dimensions";

/**
 * Compute pixel-perfect layout for preview rendering.
 * E.g., convert size, font size, line spacing, alignment.
 */
export function usePreviewLayout({
  widthMm,
  heightMm,
  lines,
  fontScale = 1
}: {
  widthMm: number,
  heightMm: number,
  lines: { fontSize: number; curved?: boolean }[],
  fontScale?: number
}) {
  const widthPx = mmToPx(widthMm);
  const heightPx = mmToPx(heightMm);

  // Example: Compute line heights in px
  const lineHeightsPx = lines.map(line =>
    Math.round((line.fontSize || 16) * fontScale)
  );

  // Add more as needed later ...
  return { widthPx, heightPx, lineHeightsPx };
}
