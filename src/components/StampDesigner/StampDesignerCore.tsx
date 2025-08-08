
import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { useStampCart } from '@/contexts/StampCartContext';
import { toast } from "@/hooks/use-toast";
import { toCartShape, toPreviewShape } from '@/utils/shape';

export interface StampDesignerCoreProps {
  product: Product | null;
  onAddToCart?: () => void;
  onPreview?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

export const useStampDesignerCore = (product: Product | null) => {
  const { t } = useTranslation();
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Cart context
  const { addStampToCart, getItemCount } = useStampCart();
  
  // Use the unified hook (which does logging, debouncing, etc)
  const designer = useStampDesigner(product);

  const handleAddToCart = () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Please select a product first",
        variant: "destructive"
      });
      return;
    }

    // Validate that we have at least some text
    const hasText = designer.design.lines.some(line => line.text.trim().length > 0);
    if (!hasText) {
      toast({
        title: "Add Text Required",
        description: "Please add at least one line of text to your stamp",
        variant: "destructive"
      });
      return;
    }

    // Add to cart with current design
    addStampToCart({
      product,
      customText: designer.design.lines,
      inkColor: designer.design.inkColor,
      logoImage: designer.design.logoImage,
      logoPosition: designer.design.logoPosition,
      includeLogo: designer.design.includeLogo,
      borderStyle: designer.design.borderStyle,
      borderThickness: designer.design.borderThickness,
      shape: toCartShape(designer.design.shape),
      previewImage: designer.previewImage,
      quantity: 1
    });

    toast({
      title: "✅ Added to Cart",
      description: `${product.name} has been added to your cart`,
    });

    return true;
  };

  // Convert shape for StampPreviewEnhanced using shared util
  const convertShapeForPreview = toPreviewShape;

  return {
    designer,
    previewRef,
    handleAddToCart,
    getItemCount,
    convertShapeForPreview,
    t
  };
};
