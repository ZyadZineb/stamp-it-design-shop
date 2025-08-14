export function computeLineBaselines({ 
  hPx, 
  top = 10, 
  bottom = 10, 
  count, 
  extraSpacingPx 
}: {
  hPx: number; 
  top?: number; 
  bottom?: number; 
  count: number; 
  extraSpacingPx: number;
}) {
  const safeTop = top; 
  const safeBot = hPx - bottom; 
  const H = safeBot - safeTop;
  
  if (count <= 1) return [safeTop + H / 2];
  
  const step = H / (count + 1);
  return Array.from({ length: count }, (_, i) => 
    Math.round(safeTop + step * (i + 1) + i * extraSpacingPx)
  ).map(y => Math.min(hPx - 10, Math.max(10, y)));
}