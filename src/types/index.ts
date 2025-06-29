
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

export type StampTextLine = {
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  curved?: boolean;
  xPosition?: number;
  yPosition?: number;
  isDragging?: boolean;
  textEffect?: TextEffect;
  letterSpacing?: number;
  textPosition?: 'top' | 'bottom' | 'left' | 'right'; // synchronized property
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
