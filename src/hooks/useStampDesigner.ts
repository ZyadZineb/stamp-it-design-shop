
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
  setBorderStyle: (style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double') => void;
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

// Unified stamp designer hook
export const useStampDesigner = (product: Product | null): UseStampDesignerReturn => {
  // Logging mount
  useEffect(() => {
    if (product) {
      console.log("[StampDesigner] useStampDesigner mounted for product:", product.id);
    }
  }, [product]);

  // All primary logic is merged in enhanced (to avoid version drift)
  const enhancedDesigner = useStampDesignerEnhanced(product);

  // Hook action logging
  const logAction = (name: string, ...args: any[]) => {
    // Logging only in non-prod
    if (process.env.NODE_ENV !== "production") {
      console.log(`[StampDesigner][Action] ${name}`, ...args);
    }
  };

  return {
    ...enhancedDesigner,
    updateLine: (i, upd) => { logAction("updateLine", i, upd); enhancedDesigner.updateLine(i, upd); },
    addLine: () => { logAction("addLine"); enhancedDesigner.addLine(); },
    removeLine: (i) => { logAction("removeLine", i); enhancedDesigner.removeLine(i); },
    setInkColor: (c) => { logAction("setInkColor", c); enhancedDesigner.setInkColor(c); },
    toggleLogo: () => { logAction("toggleLogo"); enhancedDesigner.toggleLogo(); },
    setLogoPosition: (pos) => { logAction("setLogoPosition", pos); enhancedDesigner.setLogoPosition(pos); },
    updateLogoPosition: (x, y) => { logAction("updateLogoPosition", x, y); enhancedDesigner.updateLogoPosition(x, y); },
    setBorderStyle: (s) => { logAction("setBorderStyle", s); enhancedDesigner.setBorderStyle(s); },
    setBorderThickness: (t) => { logAction("setBorderThickness", t); enhancedDesigner.setBorderThickness(t); },
    toggleCurvedText: (index, pos) => { logAction("toggleCurvedText", index, pos); enhancedDesigner.toggleCurvedText(index, pos); },
    updateTextPosition: (index, x, y) => { logAction("updateTextPosition", index, x, y); enhancedDesigner.updateTextPosition(index, x, y); },
    startTextDrag: (idx) => { logAction("startTextDrag", idx); enhancedDesigner.startTextDrag(idx); },
    startLogoDrag: () => { logAction("startLogoDrag"); enhancedDesigner.startLogoDrag(); },
    stopDragging: () => { logAction("stopDragging"); enhancedDesigner.stopDragging(); },
    handleDrag: (evt, rect) => { logAction("handleDrag", evt, rect); enhancedDesigner.handleDrag(evt, rect); },
    downloadAsPng: () => { logAction("downloadAsPng"); enhancedDesigner.downloadAsPng(); },
    zoomIn: () => { logAction("zoomIn"); enhancedDesigner.zoomIn(); },
    zoomOut: () => { logAction("zoomOut"); enhancedDesigner.zoomOut(); },
    applyTemplate: (tpl) => { logAction("applyTemplate", tpl); enhancedDesigner.applyTemplate(tpl); },
    updateMultipleLines: (lines) => { logAction("updateMultipleLines", lines); enhancedDesigner.updateMultipleLines(lines); },
    enhancedAutoArrange: () => { logAction("enhancedAutoArrange"); enhancedDesigner.enhancedAutoArrange(); },
    setGlobalAlignment: (a) => { logAction("setGlobalAlignment", a); enhancedDesigner.setGlobalAlignment(a); },
    previewImage: enhancedDesigner.previewImage,
    design: enhancedDesigner.design,
    zoomLevel: enhancedDesigner.zoomLevel,
  };
};
