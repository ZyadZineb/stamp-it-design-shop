
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Wand } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { StampDesign, StampTextLine } from '@/types';

interface AutoArrangeProps {
  design: StampDesign;
  onEnhancedAutoArrange: () => void;
  shape: 'rectangle' | 'circle' | 'square';
}

const AutoArrange: React.FC<AutoArrangeProps> = ({ design, onEnhancedAutoArrange, shape }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <HelpTooltip content={t('design.autoArrangeTooltip', "Intelligently arrange text for optimal layout based on your stamp shape, maintaining proper orientation and spacing.")}>
        <Button 
          onClick={onEnhancedAutoArrange} 
          variant="outline" 
          className="w-full flex items-center justify-center"
        >
          <Wand className="mr-2" size={16} />
          {t('design.autoArrange', "Auto-Arrange")}
        </Button>
      </HelpTooltip>
    </div>
  );
};

export default AutoArrange;
