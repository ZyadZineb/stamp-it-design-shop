
import { useState, useEffect } from 'react';
import useStampDesignerEnhanced from './useStampDesignerEnhanced';
import { Product, StampDesign, StampTextLine } from '@/types';

export interface UseStampDesignerReturn {
  design: StampDesign;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  setInkColor: (color: string) => void;
  toggleLogo: () => void;
  setLogoPosition: (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => void;
  updateLogoPosition: (x: number, y: number) => void;
  setBorderStyle: (style: 'single' | 'double' | 'triple' | 'none') => void;
  toggleCurvedText: (index: number) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  startTextDrag: (index: number) => void;
  startLogoDrag: () => void;
  stopDragging: () => void;
  handleDrag: (e: any, rect: DOMRect) => void;
  previewImage: string | null;
  downloadAsPng: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomLevel: number;
  applyTemplate: (template: Partial<StampDesign>) => void;
}

// Set up default stamp text line
const defaultLine: StampTextLine = {
  text: '',
  fontSize: 16,
  fontFamily: 'Arial',
  bold: false,
  italic: false,
  alignment: 'center',
  curved: false,
};

export const useStampDesigner = (product: Product | null): UseStampDesignerReturn => {
  // Initialize with enhanced hook
  const enhancedDesigner = useStampDesignerEnhanced(product);
  
  // Extract what we need from the enhanced hook
  const { 
    design, 
    updateLine, 
    addLine, 
    removeLine, 
    setInkColor, 
    toggleLogo, 
    setLogoPosition, 
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate
  } = enhancedDesigner;

  // Return the same interface
  return {
    design,
    updateLine,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    updateLogoPosition,
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate
  };
};
