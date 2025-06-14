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
  shape?: 'rectangle' | 'circle' | 'square';
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
  xPosition?: number; // -100 to 100 percentage offset from center
  yPosition?: number; // -100 to 100 percentage offset from default position
  isDragging?: boolean;
  textEffect?: TextEffect;
  letterSpacing?: number;
  textPosition?: 'top' | 'bottom' | 'left' | 'right'; // <-- Added property to fix build errors
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
  shape: 'rectangle' | 'square' | 'circle';
  borderStyle: 'single' | 'double' | 'triple' | 'none';
  elements: StampElement[];
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
