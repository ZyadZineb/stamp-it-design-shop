import React from 'react';
import type { GlyphPose } from '@/engine/curvedText';

interface CurvedTextSvgProps {
  poses: GlyphPose[];
  fill: string;
  fontFamily: string;
  fontSizePx: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

const CurvedTextSvg: React.FC<CurvedTextSvgProps> = ({ poses, fill, fontFamily, fontSizePx, fontWeight = 'normal', fontStyle = 'normal' }) => {
  return (
    <g>
      {poses.map((g, idx) => (
        <text
          key={idx}
          x={g.x}
          y={g.y}
          fill={fill}
          fontFamily={fontFamily}
          fontSize={fontSizePx}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${(g.angleRad * 180) / Math.PI} ${g.x} ${g.y})`}
        >
          {g.char}
        </text>
      ))}
    </g>
  );
};

export default CurvedTextSvg;
