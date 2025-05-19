
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
      // For circular stamps, identify which lines should be on top/bottom arcs and which in center
      const centerLines: StampTextLine[] = [];
      const arcLines: StampTextLine[] = [];
      
      // Heuristic: Longer lines (>15 chars) likely belong in center, shorter ones on arcs
      nonEmptyLines.forEach(line => {
        if (line.text.length > 15 || (line.text.includes(',') && line.text.length > 10)) {
          centerLines.push({...line, curved: false});
        } else {
          arcLines.push({...line, curved: true});
        }
      });
      
      // Position arc lines around the circle perimeter
      if (arcLines.length > 0) {
        arcLines.forEach((line, index) => {
          // Determine if line should be on top or bottom based on position in array
          const isTopHalf = index < Math.ceil(arcLines.length / 2);
          const arcPosition = isTopHalf ? -70 : 70; // -70 for top, 70 for bottom
          
          // Set curved for circle stamps
          line.curved = true;
          
          // Adjust position based on top/bottom
          line.yPosition = arcPosition;
          
          // Adjust font size based on line count
          line.fontSize = Math.max(16, 24 - arcLines.length * 1.5);
          
          // Ensure alignment is centered for curved text
          line.alignment = 'center';
        });
      }
      
      // Position center lines in the middle of the stamp
      if (centerLines.length > 0) {
        centerLines.forEach((line, index) => {
          // Calculate vertical position for center lines
          const totalLines = centerLines.length;
          const middleIndex = (totalLines - 1) / 2;
          const relativePosition = index - middleIndex;
          const spacing = 20; // Spacing between lines
          
          line.curved = false;
          line.yPosition = relativePosition * spacing;
          line.xPosition = 0; // center horizontally
          line.fontSize = Math.max(14, 20 - centerLines.length * 1.2);
          line.alignment = 'center';
        });
      }
      
      // Combine both sets of lines
      const arrangedLines = [...arcLines, ...centerLines];
      
      // Merge with empty lines
      const emptyLines = updatedLines.filter(line => !line.text.trim().length);
      const finalLines = [...arrangedLines, ...emptyLines];
      
      onArrange(finalLines);
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
      
      // Merge updated non-empty lines back with empty lines
      const emptyLines = updatedLines.filter(line => !line.text.trim().length);
      const finalLines = [...nonEmptyLines, ...emptyLines];
      
      onArrange(finalLines);
    }
  };

  return (
    <div className="mb-4">
      <HelpTooltip content={t('design.autoArrangeTooltip', "Intelligently arrange text for optimal layout based on your stamp shape. Places curved text along the edges and centered text in the middle.")}>
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
