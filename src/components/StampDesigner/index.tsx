
import React from 'react';
import { Product } from '@/types';
import StampDesignerWizard from './StampDesignerWizard';

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

// This is a wrapper component that maintains the same API but uses the new wizard implementation
const StampDesigner: React.FC<StampDesignerProps> = ({ 
  product, 
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
  return (
    <StampDesignerWizard 
      product={product} 
      onAddToCart={onAddToCart} 
      highContrast={highContrast}
      largeControls={largeControls}
    />
  );
};

export default StampDesigner;
