
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

export type StampTextLine = {
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  alignment: 'left' | 'center' | 'right';
  // Added curved text support for circular stamps
  curved?: boolean;
};

export interface StampDesign {
  lines: StampTextLine[];
  inkColor: string;
  includeLogo: boolean;
  logoImage?: string;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  shape: 'rectangle' | 'circle' | 'square'; // Match the product shape
  borderStyle?: 'single' | 'double' | 'none'; // Added border style options
}

