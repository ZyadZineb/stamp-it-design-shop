import React from 'react';
import { mmToPx } from '@/utils/dimensions';
import type { StraightLine } from '@/types/line';

interface StraightTextSvgProps {
  line: StraightLine;
}

const anchorMap = {
  left: 'start',
  center: 'middle',
  right: 'end',
} as const;

const StraightTextSvg: React.FC<StraightTextSvgProps> = ({ line }) => {
  const x = mmToPx(line.xMm);
  const y = mmToPx(line.yMm);
  const fontSize = mmToPx(line.fontSizeMm);
  const letterSpacing = mmToPx(line.letterSpacingMm);

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchorMap[line.align]}
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
