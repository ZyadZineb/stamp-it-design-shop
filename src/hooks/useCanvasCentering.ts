
import { useCallback } from 'react';
import { StampTextLine, StampDesign } from '@/types';

export const useCanvasCentering = () => {
  // Calculate precise canvas dimensions from product size
  const getCanvasDimensions = useCallback((productSize: string) => {
    const sizeDimensions = productSize.replace('mm', '').split('x').map(dim => parseInt(dim.trim(), 10));
    const width = sizeDimensions[0] ? sizeDimensions[0] * 10 : 380; // 10px per mm
    const height = sizeDimensions[1] ? sizeDimensions[1] * 10 : 140;
    return { width, height };
  }, []);

  // Calculate text bounding box for a line
  const calculateTextBounds = useCallback((line: StampTextLine, fontSize: number) => {
    // Approximate text metrics based on font properties
    const charWidth = fontSize * 0.6; // Average character width
    const lineHeight = fontSize * 1.2; // Standard line height
    
    const width = line.text.length * charWidth;
    const height = lineHeight;
    
    return { width, height };
  }, []);

  // Calculate centered position for an element
  const calculateCenteredPosition = useCallback((
    elementWidth: number,
    elementHeight: number,
    canvasWidth: number,
    canvasHeight: number,
    alignment: 'left' | 'center' | 'right' = 'center'
  ) => {
    let x: number;
    const y = (canvasHeight - elementHeight) / 2;
    
    switch (alignment) {
      case 'left':
        x = 20; // Left margin
        break;
      case 'right':
        x = canvasWidth - elementWidth - 20; // Right margin
        break;
      case 'center':
      default:
        x = (canvasWidth - elementWidth) / 2;
        break;
    }
    
    return { x, y };
  }, []);

  // Calculate multi-line text group bounds
  const calculateMultiLineGroupBounds = useCallback((
    lines: StampTextLine[],
    baseFontSize: number
  ) => {
    const nonEmptyLines = lines.filter(line => line.text.trim().length > 0);
    if (nonEmptyLines.length === 0) return { width: 0, height: 0 };

    let maxWidth = 0;
    let totalHeight = 0;

    nonEmptyLines.forEach((line, index) => {
      const fontSize = (line.fontSize / 16) * baseFontSize;
      const bounds = calculateTextBounds(line, fontSize);
      maxWidth = Math.max(maxWidth, bounds.width);
      totalHeight += bounds.height;
      
      // Add line spacing except for the last line
      if (index < nonEmptyLines.length - 1) {
        totalHeight += fontSize * 0.2; // 20% of font size for line spacing
      }
    });

    return { width: maxWidth, height: totalHeight };
  }, [calculateTextBounds]);

  // Auto-center text lines as a group
  const centerTextGroup = useCallback((
    lines: StampTextLine[],
    canvasWidth: number,
    canvasHeight: number,
    baseFontSize: number,
    globalAlignment: 'left' | 'center' | 'right' = 'center'
  ): StampTextLine[] => {
    const nonEmptyLines = lines.filter(line => line.text.trim().length > 0);
    if (nonEmptyLines.length === 0) return lines;

    // Calculate group bounds
    const groupBounds = calculateMultiLineGroupBounds(nonEmptyLines, baseFontSize);
    
    // Calculate group position
    const groupPosition = calculateCenteredPosition(
      groupBounds.width,
      groupBounds.height,
      canvasWidth,
      canvasHeight,
      globalAlignment
    );

    // Position each line within the group
    let currentY = groupPosition.y;
    const centeredLines = [...lines];

    nonEmptyLines.forEach((line, index) => {
      const lineIndex = lines.findIndex(l => l === line);
      const fontSize = (line.fontSize / 16) * baseFontSize;
      const lineBounds = calculateTextBounds(line, fontSize);
      
      let lineX: number;
      switch (line.alignment || globalAlignment) {
        case 'left':
          lineX = groupPosition.x;
          break;
        case 'right':
          lineX = groupPosition.x + groupBounds.width - lineBounds.width;
          break;
        case 'center':
        default:
          lineX = groupPosition.x + (groupBounds.width - lineBounds.width) / 2;
          break;
      }

      centeredLines[lineIndex] = {
        ...line,
        xPosition: ((lineX - canvasWidth / 2) / (canvasWidth / 2)) * 100, // Convert to percentage
        yPosition: ((currentY + lineBounds.height / 2 - canvasHeight / 2) / (canvasHeight / 2)) * 100
      };

      currentY += lineBounds.height + (index < nonEmptyLines.length - 1 ? fontSize * 0.2 : 0);
    });

    return centeredLines;
  }, [calculateMultiLineGroupBounds, calculateCenteredPosition, calculateTextBounds]);

  return {
    getCanvasDimensions,
    calculateTextBounds,
    calculateCenteredPosition,
    calculateMultiLineGroupBounds,
    centerTextGroup
  };
};
