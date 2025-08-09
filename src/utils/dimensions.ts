
/**
 * Dimensions utilities with exact mm → px mapping.
 * Default screen mapping: 10 px per mm (rounded to nearest px).
 */
export const PX_PER_MM = 10;
export const mmToPx = (mm: number): number => Math.round(mm * PX_PER_MM);

export const parseSize = (size: string) => {
  const s = size.toLowerCase().replace('mm', '').trim();
  if (s.includes('x')) {
    const [w, h] = s.split('x').map(parseFloat);
    return { widthMm: w, heightMm: h };
  }
  const d = parseFloat(s);
  return { widthMm: d, heightMm: d };
};

export const sizePx = (size: string) => {
  const { widthMm, heightMm } = parseSize(size);
  return { widthPx: mmToPx(widthMm), heightPx: mmToPx(heightMm) };
};
