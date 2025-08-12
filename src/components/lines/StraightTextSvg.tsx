import React from 'react';
import { mmToPx } from '@/utils/dimensions';
import type { StraightLine } from '@/types/line';
import { clamp, safePx, DEFAULT_SAFE_MM } from '@/utils/layout';

interface StraightTextSvgProps {
  line: StraightLine;
  widthPx: number;
  heightPx: number;
}

const anchorMap = {
  left: 'start',
  center: 'middle',
  right: 'end',
} as const;

const StraightTextSvg: React.FC<StraightTextSvgProps> = ({ line, widthPx, heightPx }) => {
  const safe = safePx(DEFAULT_SAFE_MM);
  const fontSize = mmToPx(line.fontSizeMm);
  const letterSpacing = mmToPx(line.letterSpacingMm);
  const font = `${line.fontStyle || 'normal'} ${line.fontWeight || 400} ${fontSize}px ${line.fontFamily}`;

  // Measure total width with letter spacing
  const measure = (text: string) => {
    const c = document.createElement('canvas');
    const k = c.getContext('2d')!;
    k.font = font;
    if (!text) return 0;
    if (letterSpacing > 0) {
      return text.split('').reduce((a, ch) => a + k.measureText(ch).width, 0) + (text.length - 1) * letterSpacing;
    }
    return k.measureText(text).width;
  };

  const w = measure(line.text || '');
  const anchor = line.align || 'center';

  const minX = safe + (anchor === 'right' ? w : 0);
  const maxX = (widthPx - safe) - (anchor === 'left' ? w : 0);

  const x0 = mmToPx(line.xMm);
  const y0 = mmToPx(line.yMm);

  const x = clamp(x0, minX, maxX);
  const y = clamp(y0, safe, heightPx - safe);

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchorMap[anchor]}
      dominantBaseline={line.baseline}
      fontFamily={line.fontFamily}
      fontWeight={line.fontWeight as any}
      fontStyle={line.fontStyle}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      fill={line.color || 'currentColor'}
    >
      {line.text}
    </text>
  );
};

export default StraightTextSvg;
