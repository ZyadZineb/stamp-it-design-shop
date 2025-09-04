export type LineType = 'straight' | 'curved';
export type LineAlign = 'start' | 'center' | 'end';

export interface LineCurve {
  enabled: boolean;
  radiusMm?: number; // mm from center (circle) or chosen center (rect)
  startAngleDeg?: number; // default depends on placement
  sweepDeg?: number; // arc span in degrees (positive = CW)
  direction?: 'outer' | 'inner'; // flips vertical orientation
  flipped?: boolean; // flips text upside down for bottom curves
  fitMode?: 'none' | 'textLength' | 'letterSpacing' | 'fontScale';
}

export type BaseLine = {
  id: string;
  type: LineType;
  text: string;
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontSizePt: number;
  letterSpacing: number; // px
  lineSpacing: number; // px (only used for straight lines)
  color?: string;
  visible?: boolean;
  align: LineAlign; // affects startOffset on curved paths
  curve?: LineCurve; // new
};

export type StraightLine = BaseLine & {
  type: 'straight';
  xMm: number; // horizontal position from left edge
  yMm: number; // vertical position from top edge
  baseline: 'middle' | 'alphabetic' | 'hanging';
};

export type CurvedLine = BaseLine & {
  type: 'curved';
  radiusMm: number;
  arcDeg: number;
  direction: 'outside' | 'inside';
  axisXMm: number; // center X of arc
  axisYMm: number; // center Y of arc
  rotationDeg: number; // rotate arc around axis
};

export type DesignerLine = StraightLine | CurvedLine;