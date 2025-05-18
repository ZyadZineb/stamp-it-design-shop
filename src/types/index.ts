
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
  shape?: 'rectangle' | 'circle' | 'square'; // Add shape property
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
  type: 'shadow' | 'outline' | 'none';
  color?: string;
  blur?: number;
  thickness?: number;
}

export type StampTextLine = {
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  // Added curved text support for circular stamps
  curved?: boolean;
  // Added position adjustments
  xPosition?: number; // -100 to 100 percentage offset from center
  yPosition?: number; // -100 to 100 percentage offset from default position
  // Added drag state
  isDragging?: boolean;
  // Added text effects
  textEffect?: TextEffect;
};

export interface StampDesign {
  lines: StampTextLine[];
  inkColor: string;
  includeLogo: boolean;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  logoX: number;
  logoY: number;
  logoImage?: string;
  logoDragging: boolean;
  shape: 'rectangle' | 'circle' | 'square';
  borderStyle: 'none' | 'single' | 'double';
  elements?: StampElement[]; // Custom elements like QR codes
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
