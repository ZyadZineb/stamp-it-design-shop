
import React from 'react';
import { Product } from '@/types';
import StampDesignerWizard from './StampDesignerWizard';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
  onPreview?: () => void;
  currentStep?: 'customize' | 'preview' | 'order';
}

// This is a wrapper component that maintains the same API but uses the new wizard implementation
const StampDesigner: React.FC<StampDesignerProps> = ({ 
  product, 
  onAddToCart,
  onPreview,
  currentStep = 'customize'
}) => {
  const { t } = useTranslation();

  // Display a welcome toast when the component mounts
  React.useEffect(() => {
    if (product && currentStep === 'customize') {
      toast({
        title: t('design.welcome', "Welcome to the Stamp Designer"),
        description: t('design.welcomeDesc', "Follow the step-by-step wizard to create your custom stamp"),
      });
    }
  }, [product, currentStep]);

  return (
    <StampDesignerWizard 
      product={product} 
      onAddToCart={onAddToCart}
      onPreview={onPreview}
      currentStep={currentStep}
    />
  );
};

export default StampDesigner;
