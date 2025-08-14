import React, { useId, useMemo } from 'react';
import { describeArc, mmToPx } from '@/lib/curves';
import { LineCurve, LineAlign } from '@/types/line';

interface CurvedTextLineProps {
  text: string;
  align: LineAlign;
  fontFamily: string;
  fontSizePx: number;
  letterSpacing: number;
  curve: Required<LineCurve>;
  wPx: number;
  hPx: number;
  color?: string;
}

export default function CurvedTextLine({
  text,
  align,
  fontFamily,
  fontSizePx,
  letterSpacing,
  curve,
  wPx,
  hPx,
  color = 'currentColor'
}: CurvedTextLineProps) {
  const id = useId();
  const cx = wPx / 2;
  const cy = hPx / 2;
  
  // Calculate radius with safe zone (10px = 1mm)
  const minRadius = (Math.min(wPx, hPx) / 2) - 10;
  const r = Math.max(minRadius, curve.radiusMm ? mmToPx(curve.radiusMm) : minRadius);
  
  const start = curve.startAngleDeg ?? -90; // default top arc
  const sweep = curve.sweepDeg ?? 180; // default half circle
  const end = start + sweep;
  
  // Adjust for direction
  const actualStart = curve.direction === 'inner' ? start + 180 : start;
  const actualEnd = curve.direction === 'inner' ? end + 180 : end;
  
  const d = useMemo(() => 
    describeArc(cx, cy, r, actualStart, actualEnd), 
    [cx, cy, r, actualStart, actualEnd]
  );
  
  const startOffset = align === 'center' ? '50%' : align === 'end' ? '100%' : '0%';
  
  // Apply fit modes
  const textProps: any = {
    fontFamily,
    fontSize: fontSizePx,
    fill: color,
    style: { letterSpacing }
  };
  
  if (curve.fitMode === 'textLength') {
    const arcLength = (Math.abs(sweep) / 360) * (2 * Math.PI * r);
    textProps.textLength = arcLength;
    textProps.lengthAdjust = 'spacing';
  }
  
  return (
    <g {...textProps}>
      <path id={id} d={d} fill="none" />
      <text>
        <textPath href={`#${id}`} startOffset={startOffset} method="align" spacing="auto">
          {text}
        </textPath>
      </text>
    </g>
  );
}