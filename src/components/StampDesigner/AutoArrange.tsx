
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Wand } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { StampDesign, StampTextLine } from '@/types';

interface AutoArrangeProps {
  design: StampDesign;
  onArrange: (updatedLines: StampTextLine[]) => void;
  shape: 'rectangle' | 'circle' | 'square';
}

const AutoArrange: React.FC<AutoArrangeProps> = ({ design, onArrange, shape }) => {
  const { t } = useTranslation();
  
  const handleAutoArrange = () => {
    // Create a copy of the design lines
    const updatedLines = [...design.lines];
    const nonEmptyLines = updatedLines.filter(line => line.text.trim().length > 0);
    
    if (nonEmptyLines.length === 0) return;
    
    // Distribute the lines evenly based on shape
    if (shape === 'circle') {
      // For circular stamps, position text evenly along a circle
      nonEmptyLines.forEach((line, index) => {
        // Set curved for circle stamps
        line.curved = true;
        
        // Adjust position based on index
        const yOffset = (index - Math.floor(nonEmptyLines.length / 2)) * 20;
        line.yPosition = yOffset;
        
        // Adjust font size based on line count
        line.fontSize = Math.max(16, 24 - nonEmptyLines.length * 1.5);
        
        // Ensure alignment is centered for curved text
        line.alignment = 'center';
      });
    } else {
      // For rectangular or square stamps, distribute vertically
      nonEmptyLines.forEach((line, index) => {
        // Calculate position for evenly distributed lines
        const totalHeight = 160; // arbitrary value for distribution calculation
        const spacing = totalHeight / (nonEmptyLines.length + 1);
        const yOffset = (index + 1) * spacing - totalHeight / 2;
        
        line.yPosition = yOffset;
        line.xPosition = 0; // center horizontally
        line.curved = false;
        
        // Adjust font size based on line count
        line.fontSize = Math.max(14, 20 - nonEmptyLines.length * 1.2);
        
        // Center alignment for better default appearance
        line.alignment = 'center';
      });
    }
    
    // Merge updated non-empty lines back with empty lines
    const emptyLines = updatedLines.filter(line => !line.text.trim().length);
    const finalLines = [...nonEmptyLines, ...emptyLines];
    
    onArrange(finalLines);
  };

  return (
    <div className="mb-4">
      <HelpTooltip content={t('design.autoArrangeTooltip', "Automatically adjust text position and formatting for optimal layout based on your stamp shape and text content.")}>
        <Button 
          onClick={handleAutoArrange} 
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
