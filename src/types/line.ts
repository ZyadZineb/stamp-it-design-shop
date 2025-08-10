export type LineType = 'straight' | 'curved';

export type BaseLine = {
  id: string;
  type: LineType;
  text: string;
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  fontSizeMm: number;
  letterSpacingMm: number;
  color?: string;
  visible?: boolean;
};

export type StraightLine = BaseLine & {
  type: 'straight';
  xMm: number; // horizontal position from left edge
  yMm: number; // vertical position from top edge
  align: 'left' | 'center' | 'right';
  baseline: 'middle' | 'alphabetic' | 'hanging';
};

export type CurvedLine = BaseLine & {
  type: 'curved';
  radiusMm: number;
  arcDeg: number;
  align: 'center' | 'start' | 'end';
  direction: 'outside' | 'inside';
  axisXMm: number; // center X of arc
  axisYMm: number; // center Y of arc
  rotationDeg: number; // rotate arc around axis
};

export type DesignerLine = StraightLine | CurvedLine;
