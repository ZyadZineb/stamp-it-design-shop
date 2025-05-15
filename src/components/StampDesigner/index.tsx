
import React from 'react';
import { Product } from '@/types';
import StampDesignerWizard from './StampDesignerWizard';

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
}

// This is a wrapper component that maintains the same API but uses the new wizard implementation
const StampDesigner: React.FC<StampDesignerProps> = ({ product, onAddToCart }) => {
  return <StampDesignerWizard product={product} onAddToCart={onAddToCart} />;
};

export default StampDesigner;
