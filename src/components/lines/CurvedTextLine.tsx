import React, { useMemo } from 'react';
import { mmToPx } from '@/utils/dimensions';
import { layoutArc } from '@/engine/curvedText';
import CurvedTextSvg from '@/components/CurvedTextSvg';
import type { CurvedLine } from '@/types/line';

interface CurvedTextLineProps {
  line: CurvedLine;
}

const CurvedTextLine: React.FC<CurvedTextLineProps> = ({ line }) => {
  const fontSizePx = mmToPx(line.fontSizeMm);
  const letterSpacingPx = mmToPx(line.letterSpacingMm);
  const fontWeight = (typeof line.fontWeight === 'number' ? (line.fontWeight >= 600 ? 'bold' : 'normal') : (line.fontWeight as any)) || 'normal';
  const fontStyle = line.fontStyle || 'normal';

  const poses = useMemo(() => {
    return layoutArc({
      text: line.text,
      centerX: mmToPx(line.axisXMm),
      centerY: mmToPx(line.axisYMm),
      radiusPx: Math.max(0, mmToPx(line.radiusMm)),
      arcDegrees: line.arcDeg,
      align: line.align,
      direction: line.direction,
      letterSpacingPx,
      font: `${fontStyle} ${fontWeight} ${fontSizePx}px ${line.fontFamily}`,
      rotationDeg: line.rotationDeg,
    });
  }, [line.text, line.axisXMm, line.axisYMm, line.radiusMm, line.arcDeg, line.align, line.direction, letterSpacingPx, fontSizePx, fontStyle, fontWeight, line.fontFamily, line.rotationDeg]);

  return (
    <CurvedTextSvg
      poses={poses}
      fill={line.color || 'currentColor'}
      fontFamily={line.fontFamily}
      fontSizePx={fontSizePx}
      fontWeight={fontWeight as any}
      fontStyle={fontStyle as any}
    />
  );
};

export default CurvedTextLine;
