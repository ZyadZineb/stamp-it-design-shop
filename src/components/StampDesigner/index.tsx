
import React from 'react';
import { Product } from '@/types';
import StampDesignerMain from './StampDesignerMain';

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
}

// This is a simple wrapper component that maintains the same API
const StampDesigner: React.FC<StampDesignerProps> = ({ product, onAddToCart }) => {
  return <StampDesignerMain product={product} onAddToCart={onAddToCart} />;
};

export default StampDesigner;
