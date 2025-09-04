
export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  size: string;
  lines: number;
  colors: string[];
  inkColors: string[];
  images: string[];
  description: string;
  featured?: boolean;
  shape: 'rectangle' | 'circle' | 'square' | 'ellipse';
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  customText?: string;
  inkColor?: string;
  previewImage?: string;
}

export interface TextEffect {
  type: 'shadow' | 'outline' | 'none' | 'separator';
  color?: string;
  blur?: number;
  thickness?: number;
  separatorChar?: '★' | '•' | '|';
}

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

export type StampTextLine = {
  id: string;
  text: string;
  align: LineAlign; // affects startOffset on curved paths
  fontFamily: string;
  fontSizePt: number;
  letterSpacing: number; // px
  lineSpacing: number; // px (only used for straight lines)
  curve?: LineCurve; // new
  // Legacy compatibility
  fontSize: number;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  curved?: boolean;
  xPosition?: number;
  yPosition?: number;
  isDragging?: boolean;
  textEffect?: TextEffect;
  textPosition?: 'top' | 'bottom' | 'left' | 'right'; // synchronized property
  // New optional mm-based and advanced fields (backward-compatible)
  color?: string;
  visible?: boolean;
  fontSizeMm?: number;
  letterSpacingMm?: number;
  xMm?: number;
  yMm?: number;
  // Curved text advanced controls
  axisXMm?: number;
  axisYMm?: number;
  rotationDeg?: number;
  radiusMm?: number;
  arcDeg?: number;
  curvedAlign?: 'center' | 'start' | 'end';
  direction?: 'outside' | 'inside';
  // Straight baseline control
  baseline?: 'middle' | 'alphabetic' | 'hanging';
};

export interface StampDesign {
  lines: StampTextLine[];
  inkColor: string;
  includeLogo: boolean;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  logoX: number;
  logoY: number;
  logoDragging: boolean;
  logoImage?: string;
  shape: 'rectangle' | 'circle' | 'square' | 'ellipse';
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderThickness: number;
  elements?: StampElement[];
  globalAlignment?: 'left' | 'center' | 'right';
}

export interface StampElement {
  id: string;
  type: string;
  dataUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isDragging: boolean;
}
