
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
  setBorderStyle: (style: 'single' | 'double' | 'wavy' | 'none') => void;
  setBorderThickness: (thickness: number) => void;
  toggleCurvedText: (index: number, textPosition?: 'top' | 'bottom' | 'left' | 'right') => void;
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
  updateMultipleLines: (updatedLines: StampTextLine[]) => void;
  enhancedAutoArrange: () => void;
  setGlobalAlignment: (alignment: 'left' | 'center' | 'right') => void;
}

// Extend defaultLine model with textPosition, remove shadow/outline
const defaultLine: StampTextLine = {
  text: '',
  fontSize: 16,
  fontFamily: 'Arial',
  bold: false,
  italic: false,
  alignment: 'center',
  curved: false,
  letterSpacing: 0,
  xPosition: 0,
  yPosition: 0,
  textPosition: 'top'
};

export const useStampDesigner = (product: Product | null): UseStampDesignerReturn => {
  const enhancedDesigner = useStampDesignerEnhanced(product);
  
  const { 
    design, 
    updateLine, 
    addLine, 
    removeLine, 
    setInkColor, 
    toggleLogo, 
    setLogoPosition, 
    setBorderStyle,
    setBorderThickness,
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
    applyTemplate,
    updateMultipleLines,
    enhancedAutoArrange,
    setGlobalAlignment
  } = enhancedDesigner;

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
    setBorderThickness,
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
    applyTemplate,
    updateMultipleLines,
    enhancedAutoArrange,
    setGlobalAlignment
  };
};
