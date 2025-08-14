import React, { useMemo } from 'react';
import { mmToPx } from '@/utils/dimensions';
import { layoutArc } from '@/engine/curvedText';
import CurvedTextSvg from '@/components/CurvedTextSvg';
import type { CurvedLine } from '@/types/line';
import { clamp, safePx, DEFAULT_SAFE_MM } from '@/utils/layout';

interface CurvedTextLineProps {
  line: CurvedLine;
  widthPx: number;
  heightPx: number;
}

const CurvedTextLine: React.FC<CurvedTextLineProps> = ({ line, widthPx, heightPx }) => {
  const fontSizePx = mmToPx(line.fontSizePt / 10); // Convert pt to mm approximation
  const letterSpacingPx = mmToPx(line.letterSpacing / 10);
  const fontWeight = (typeof line.fontWeight === 'number' ? (line.fontWeight >= 600 ? 'bold' : 'normal') : (line.fontWeight as any)) || 'normal';
  const fontStyle = line.fontStyle || 'normal';

  const safe = safePx(DEFAULT_SAFE_MM);
  const cxPxRaw = mmToPx(line.axisXMm);
  const cyPxRaw = mmToPx(line.axisYMm);
  const cxPx = clamp(cxPxRaw, safe, widthPx - safe);
  const cyPx = clamp(cyPxRaw, safe, heightPx - safe);

  const poses = useMemo(() => {
    return layoutArc({
      text: line.text,
      fontFamily: line.fontFamily,
      fontWeight: line.fontWeight,
      fontStyle: line.fontStyle,
      fontSizePx,
      letterSpacingPx,
      radiusPx: Math.max(0.1, mmToPx(line.radiusMm)),
      arcDegrees: line.arcDeg,
      align: line.align as any || 'center',
      direction: line.direction as any || 'outside',
      centerX: cxPx,
      centerY: cyPx,
      rotationDeg: line.rotationDeg,
    });
  }, [line.text, line.fontFamily, line.fontWeight, line.fontStyle, fontSizePx, letterSpacingPx, line.radiusMm, line.arcDeg, line.align, line.direction, cxPx, cyPx, line.rotationDeg]);

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
