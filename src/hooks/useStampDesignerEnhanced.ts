import { useState, useEffect, useRef } from 'react';
import { StampDesign, StampTextLine, Product, StampElement } from '../types';
import { useCanvasCentering } from './useCanvasCentering';
import { useDebounce } from './useDebounce';
import { sizePx, mmToPx } from '@/utils/dimensions';
import { layoutArc } from '@/engine/curvedText';
import { drawCurvedText } from '@/export/drawCurvedText';

interface DesignHistoryState {
  past: StampDesign[];
  present: StampDesign;
  future: StampDesign[];
}

// Main hook function
const useStampDesignerEnhanced = (product: Product | null) => {
  const { getCanvasDimensions, centerTextGroup } = useCanvasCentering();

  // Add textPosition to model
  const defaultLine: StampTextLine = {
    id: crypto.randomUUID(),
    text: '',
    align: 'center' as const,
    fontSizePt: 16,
    letterSpacing: 0,
    lineSpacing: 0,
    fontSize: 16,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center',
    curved: false,
    xPosition: 0,
    yPosition: 0,
    isDragging: false,
    textPosition: 'top'
  };

  // Determine shape for product, treat "trodat-44055" as 'ellipse'
  function detectShape(p: Product | null) {
    if (!p) return 'rectangle';
    if (p.id === 'trodat-44055') return 'ellipse';
    return p.shape;
  }

  const initializeLines = () => {
    if (!product) return [{ ...defaultLine }];

    // Create empty lines based on product capacity
    const lines: StampTextLine[] = [];
    for (let i = 0; i < (product?.lines || 1); i++) {
      lines.push({ ...defaultLine, id: crypto.randomUUID() });
    }
    return lines;
  };

  const initialDesign: StampDesign = {
    lines: initializeLines(),
    inkColor: product?.inkColors[0] || 'blue',
    includeLogo: false,
    logoPosition: 'top',
    logoX: 0,
    logoY: 0,
    logoDragging: false,
    shape: detectShape(product),
    borderStyle: 'none',
    borderThickness: 1,
    elements: [],
    globalAlignment: 'center' // Add global alignment setting
  };

  // Design history for undo/redo functionality
  const [history, setHistory] = useState<DesignHistoryState>({
    past: [],
    present: initialDesign,
    future: []
  });

  // Active design comes from history.present
  const design = history.present;

  // Extract methods from history management
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<string | null>(null);

  // Auto-center content using the new centering logic
  const autoCenterContent = () => {
    if (!product) return design.lines;

    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product.size);
    const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;

    return centerTextGroup(
      design.lines,
      canvasWidth,
      canvasHeight,
      baseFontSize,
      design.globalAlignment || 'center'
    );
  };

  // Fix: auto-center lines and logo on init and product change (even after load).
  useEffect(() => {
    if (product) {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product.size);
      const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
      // Defensive: auto-center any lines and logo
      let linesInitial = initializeLines();
      try {
        linesInitial = centerTextGroup(
          linesInitial,
          canvasWidth,
          canvasHeight,
          baseFontSize,
          design.globalAlignment || 'center'
        );
      } catch (e) {
        console.error("[useStampDesignerEnhanced] Centering error", e);
      }
      const updatedDesign = {
        ...design,
        lines: linesInitial,
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: detectShape(product),
        logoX: 0,
        logoY: 0 // ensure logo is centered too
      };
      setHistory({
        past: [],
        present: updatedDesign,
        future: []
      });
      console.log("[useStampDesignerEnhanced] Product changed: auto-centered lines and logo", updatedDesign);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Debounce design changes for preview generation
  const debouncedDesign = useDebounce(design, 300);

  useEffect(() => {
    if (product) {
      generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDesign, product]);

  // Helper function to update history when design changes
  const updateHistory = (updatedDesign: StampDesign) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedDesign,
      future: []
    }));
  };

  // Update text line with history tracking (do NOT re-center on every style change)
  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    newLines[index] = { ...newLines[index], ...updates };
    console.log('[StampDesigner] updateLine', { index, updates });
    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };

  // Set global alignment
  const setGlobalAlignment = (alignment: 'left' | 'center' | 'right') => {
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product?.size || '38x14mm');
    const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
    const centeredLines = centerTextGroup(
      design.lines,
      canvasWidth,
      canvasHeight,
      baseFontSize,
      alignment
    );

    const updatedDesign = { 
      ...design, 
      globalAlignment: alignment,
      lines: centeredLines 
    };
    updateHistory(updatedDesign);
  };

  // Update multiple lines at once (for auto-arrange)
  const updateMultipleLines = (updatedLines: StampTextLine[]) => {
    // Validate that we aren't trying to add more lines than exist
    if (updatedLines.length > design.lines.length) {
      updatedLines = updatedLines.slice(0, design.lines.length);
    }

    // Create a new array with the same length as the original
    const newLines = [...design.lines];

    // Update only the lines that are provided
    updatedLines.forEach((line, index) => {
      if (index < newLines.length) {
        newLines[index] = { ...newLines[index], ...line };
      }
    });

    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };

  // Add line with history tracking
  const addLine = () => {
    if (design.lines.length < (product?.lines || 5)) {
      const updatedDesign = {
        ...design,
        lines: [...design.lines, { ...defaultLine, id: crypto.randomUUID() }]
      };
      console.log('[StampDesigner] addLine');
      updateHistory(updatedDesign);
    }
  };

  // Remove line with history tracking
  const removeLine = (index: number) => {
    const newLines = design.lines.filter((_, i) => i !== index);
    const updatedDesign = { ...design, lines: newLines };
    console.log('[StampDesigner] removeLine', index);
    updateHistory(updatedDesign);
  };

  // Set ink color with history tracking
  const setInkColor = (color: string) => {
    console.log('[StampDesigner] setInkColor', color);
    const updatedDesign = { ...design, inkColor: color };
    updateHistory(updatedDesign);
  };

  // Toggle logo inclusion with history tracking
  const toggleLogo = () => {
    console.log('[StampDesigner] toggleLogo', !design.includeLogo);
    const updatedDesign = { ...design, includeLogo: !design.includeLogo };
    updateHistory(updatedDesign);
  };

  // Set logo position with history tracking
  const setLogoPosition = (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    console.log('[StampDesigner] setLogoPosition', position);
    const updatedDesign = { ...design, logoPosition: position };
    updateHistory(updatedDesign);
  };

  // Set logo image with history tracking
  const setLogoImage = (imageUrl: string) => {
    console.log('[StampDesigner] setLogoImage', imageUrl);
    const updatedDesign = { ...design, logoImage: imageUrl };
    updateHistory(updatedDesign);
  };

  // Set border style with history tracking - now handles the new border style types
  const setBorderStyle = (style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double') => {
    console.log('[StampDesigner] setBorderStyle', style);
    const updatedDesign = { ...design, borderStyle: style };
    updateHistory(updatedDesign);
  };

  // Set border thickness with history tracking
  const setBorderThickness = (thickness: number) => {
    console.log('[StampDesigner] setBorderThickness', thickness);
    const updatedDesign = { ...design, borderThickness: thickness };
    updateHistory(updatedDesign);
  };

  // Toggle curved text with history tracking
  const toggleCurvedText = (index: number, textPosition: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    console.log('[StampDesigner] toggleCurvedText', { index, textPosition });
    const current = design.lines[index];
    updateLine(index, {
      curved: !current.curved,
      textPosition: textPosition
    });
  };

  // Update text position with history tracking
  const updateTextPosition = (index: number, x: number, y: number) => {
    console.log('[StampDesigner] updateTextPosition', { index, x, y });
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));

    const newLines = [...design.lines];
    newLines[index] = {
      ...newLines[index],
      xPosition: constrainedX,
      yPosition: constrainedY
    };

    const updatedDesign = { ...design, lines: newLines };
    setHistory(prev => ({
      ...prev,
      present: updatedDesign
    }));
  };

  // Start text drag
  const startTextDrag = (index: number) => {
    console.log('[StampDesigner] startTextDrag', index);
    const newLines = [...design.lines];
    newLines.forEach((line, i) => {
      line.isDragging = i === index;
    });

    setHistory(prev => ({
      ...prev,
      present: { ...design, lines: newLines, logoDragging: false }
    }));
  };

  // Start logo drag
  const startLogoDrag = () => {
    console.log('[StampDesigner] startLogoDrag');
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });

    setHistory(prev => ({
      ...prev,
      present: { ...design, lines: newLines, logoDragging: true }
    }));
  };

  // Stop dragging
  const stopDragging = () => {
    console.log('[StampDesigner] stopDragging');
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });

    const updatedDesign = { ...design, lines: newLines, logoDragging: false };
    updateHistory(updatedDesign);
  };

  // Handle drag event
  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, previewRect: DOMRect) => {
    // Get mouse/touch position relative to preview area
    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const centerX = previewRect.left + previewRect.width / 2;
    const centerY = previewRect.top + previewRect.height / 2;

    // Calculate position as percentage from center (-100 to 100)
    const relativeX = ((clientX - centerX) / (previewRect.width / 2)) * 100;
    const relativeY = ((clientY - centerY) / (previewRect.height / 2)) * 100;

    // Update the position of the dragging element
    const draggingLineIndex = design.lines.findIndex(line => line.isDragging);

    if (draggingLineIndex !== -1) {
      // Update text position
      console.log('[StampDesigner] handleDrag - text line', draggingLineIndex, { relativeX, relativeY });
      const newLines = [...design.lines];
      newLines[draggingLineIndex] = {
        ...newLines[draggingLineIndex],
        xPosition: relativeX,
        yPosition: relativeY
      };

      setHistory(prev => ({
        ...prev,
        present: { ...design, lines: newLines }
      }));
    } else if (design.logoDragging && design.includeLogo) {
      // Update logo position
      console.log('[StampDesigner] handleDrag - logo', { relativeX, relativeY });
      setHistory(prev => ({
        ...prev,
        present: {
          ...design,
          logoX: relativeX,
          logoY: relativeY
        }
      }));
    }
  };

  // Update logo position with history tracking
  const updateLogoPosition = (x: number, y: number) => {
    console.log('[StampDesigner] updateLogoPosition', { x, y });
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));

    const updatedDesign = {
      ...design,
      logoX: constrainedX,
      logoY: constrainedY
    };

    setHistory(prev => ({
      ...prev,
      present: updatedDesign
    }));
  };

  // Undo functionality
  const undo = () => {
    if (!canUndo) return;
    console.log('[StampDesigner] undo');
    setHistory(prev => {
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: newPresent,
        future: [prev.present, ...prev.future]
      };
    });
  };

  // Redo functionality
  const redo = () => {
    if (!canRedo) return;
    console.log('[StampDesigner] redo');
    setHistory(prev => {
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: prev.future.slice(1)
      };
    });
  };

  // Save design to local storage
  const saveDesign = () => {
    if (!product) return;

    try {
      const designData = {
        designId: `stamp-${product.id}`,
        productId: product.id,
        design: design,
        savedAt: new Date().toISOString()
      };

      console.log('[StampDesigner] saveDesign', designData);
      localStorage.setItem('savedStampDesign', JSON.stringify(designData));
      return true;
    } catch (error) {
      console.error('Error saving design:', error);
      return false;
    }
  };

  // Check if there is a saved design
  const hasSavedDesign = () => {
    try {
      const savedData = localStorage.getItem('savedStampDesign');
      if (!savedData) return false;

      const { productId } = JSON.parse(savedData);
      return productId === product?.id;
    } catch (error) {
      console.error('Error checking for saved design:', error);
      return false;
    }
  };

  // Load saved design from local storage
  const loadDesign = () => {
    try {
      const savedData = localStorage.getItem('savedStampDesign');
      if (!savedData) return false;

      const { design: savedDesign, productId } = JSON.parse(savedData);

      if (productId === product?.id && savedDesign) {
        console.log('[StampDesigner] loadDesign', savedDesign);
        // Update history with saved design
        setHistory({
          past: [],
          present: savedDesign,
          future: []
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error loading saved design:', error);
      return false;
    }
  };

  // Clear saved design
  const clearSavedDesign = () => {
    try {
      localStorage.removeItem('savedStampDesign');
      console.log('[StampDesigner] clearSavedDesign');
      return true;
    } catch (error) {
      console.error('Error clearing saved design:', error);
      return false;
    }
  };

  // Apply a template to the current design
  const applyTemplate = (template: Partial<StampDesign>) => {
    if (!template) return;
    console.log('[StampDesigner] applyTemplate', template);

    const updatedDesign = {
      ...design,
      ...template,
      // Maintain product-specific properties
      shape: design.shape
    };

    updateHistory(updatedDesign);
  };

  // Add or update custom element (like QR code or barcode)
  const addElement = (element: { type: string; dataUrl: string; width: number; height: number }) => {
    console.log('[StampDesigner] addElement', element);
    // Parse dimensions from product size
    const sizeDimensions = product?.size ? product.size.split('x').map(dim => parseInt(dim.trim(), 10)) : [60, 40];

    // Define centerX and centerY based on viewBox dimensions
    const centerX = sizeDimensions[0] ? sizeDimensions[0] / 2 : 30;
    const centerY = sizeDimensions[1] ? sizeDimensions[1] / 2 : 20;

    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: 0,
      y: 0,
      isDragging: false
    };

    const updatedDesign = {
      ...design,
      elements: [...(design.elements || []), newElement]
    };

    updateHistory(updatedDesign);
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
    console.log('[StampDesigner] zoomIn');
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
    console.log('[StampDesigner] zoomOut');
  };

  // Validate design based on current step
  const validateDesign = (step: string): string[] => {
    const errors: string[] = [];

    if (step === 'text') {
      // Check if at least one line has text
      const hasText = design.lines.some(line => line.text.trim().length > 0);
      if (!hasText) {
        errors.push('Add at least one line of text to your stamp');
      }

      // Check for lines that are too long
      design.lines.forEach((line, index) => {
        if (line.text.length > 30) {
          errors.push(`Line ${index + 1} is too long. Keep it under 30 characters for better readability.`);
        }
      });
    }

    if (step === 'logo' && design.includeLogo && !design.logoImage) {
      errors.push('Please upload a logo image or disable the logo option');
    }

    if (step === 'preview') {
      // Final validation before adding to cart
      const hasText = design.lines.some(line => line.text.trim().length > 0);
      if (!hasText) {
        errors.push('Your stamp needs at least one line of text');
      }

      if (design.includeLogo && !design.logoImage) {
        errors.push('Logo option is enabled but no logo has been uploaded');
      }
    }

    return errors;
  };

  // When auto-arranging, re-center after
  const enhancedAutoArrange = () => {
    const lines = [...design.lines];
    const nonEmptyLines = lines.filter(l => l.text.trim().length > 0);
    if (nonEmptyLines.length === 0) return;

    console.log('[StampDesigner] enhancedAutoArrange: Before centering', design.lines);

    // Auto-center all content based on shape
    if (design.shape === 'circle' || design.shape === 'ellipse') {
      // For circular/elliptical stamps
      const perimeterLines: StampTextLine[] = [];
      const centerLines: StampTextLine[] = [];

      nonEmptyLines.forEach((line, idx) => {
        // If curved or short, place on perimeter
        if (line.curved || line.text.length <= 15) {
          perimeterLines.push({ 
            ...line, 
            curved: true, 
            textPosition: idx % 2 === 0 ? 'top' : 'bottom',
            xPosition: 0 // Center horizontally
          });
        } else {
          centerLines.push({ 
            ...line, 
            curved: false, 
            textPosition: 'top',
            xPosition: 0 // Center horizontally
          });
        }
      });

      // Position perimeter lines
      perimeterLines.forEach((l, idx) => {
        const isTop = l.textPosition === 'top';
        l.yPosition = isTop ? -60 : 60; // Adjusted for better centering
        l.fontSize = Math.max(16, 28 - perimeterLines.length * 2);
        l.alignment = 'center';
      });

      // Center lines in middle with proper vertical spacing
      centerLines.forEach((l, idx) => {
        const centerCount = centerLines.length;
        const totalHeight = (centerCount - 1) * 16;
        const startY = -totalHeight / 2;
        l.yPosition = startY + (idx * 16);
        l.fontSize = Math.max(14, 22 - centerCount);
        l.alignment = 'center';
      });

      const arranged = [...perimeterLines, ...centerLines];
      const result = arranged.concat(lines.slice(arranged.length).map(l => ({ ...l, text: '' })));
      updateMultipleLines(result.slice(0, lines.length));
    } else {
      // For rectangular/square stamps - perfect vertical centering
      const totalLines = nonEmptyLines.length;
      const lineHeight = 18; // Consistent line height
      const totalContentHeight = (totalLines - 1) * lineHeight;
      const startY = -totalContentHeight / 2;

      nonEmptyLines.forEach((l, idx) => {
        l.xPosition = 0; // Always center horizontally
        l.yPosition = startY + (idx * lineHeight);
        l.alignment = 'center';
        l.curved = false;
        l.fontSize = Math.max(14, 20 - totalLines);
      });

      const arranged = [...nonEmptyLines, ...lines.slice(nonEmptyLines.length).map(l => ({ ...l, text: '' }))];
      updateMultipleLines(arranged.slice(0, lines.length));
    }

    // after arranging, auto-center using the latest canvas size/font
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product?.size || '38x14mm');
    const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
    let centeredLines = [];
    try {
      centeredLines = centerTextGroup(
        lines,
        canvasWidth,
        canvasHeight,
        baseFontSize,
        design.globalAlignment || 'center'
      );
      console.log('[StampDesigner] enhancedAutoArrange: After centering', centeredLines);
    } catch (e) {
      console.error("[enhancedAutoArrange] Centering error", e);
      centeredLines = lines;
    }
    updateMultipleLines(centeredLines);
  };

  // Log any design changes/positions for debug
  useEffect(() => {
    if (product) {
      console.log("[useStampDesignerEnhanced] current design lines", design.lines.map((l, i) => ({
        idx: i,
        x: l.xPosition,
        y: l.yPosition,
        curved: l.curved,
        alignment: l.alignment,
        text: l.text
      })));
      // Logo
      console.log("[useStampDesignerEnhanced] logo pos", { x: design.logoX, y: design.logoY });
    }
  }, [design, product]);

  // Generate preview image using per-glyph curved engine and model clipPath
  const generatePreview = (): string => {
    if (!product) {
      return '';
    }

    const { widthPx, heightPx } = sizePx(product.size);
    const cx = widthPx / 2;
    const cy = heightPx / 2;
    const margin = mmToPx(1.0);
    const strokePx = Math.max(1, mmToPx(0.4));
    const clipId = `clip-${Math.random().toString(36).slice(2, 8)}`;

    // Helpers
    const borderPathRect = `<rect x="${margin}" y="${margin}" width="${widthPx - 2 * margin}" height="${heightPx - 2 * margin}" rx="${mmToPx(0.6)}" ry="${mmToPx(0.6)}" />`;
    const borderPathCircle = `<circle cx="${cx}" cy="${cy}" r="${Math.min(widthPx, heightPx) / 2 - margin}" />`;
    const borderPathEllipse = `<ellipse cx="${cx}" cy="${cy}" rx="${widthPx / 2 - margin}" ry="${heightPx / 2 - margin}" />`;

    let svgContent = `
      <svg width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${design.shape === 'circle'
            ? `<clipPath id="${clipId}">${borderPathCircle}</clipPath>`
            : design.shape === 'ellipse'
              ? `<clipPath id="${clipId}">${borderPathEllipse}</clipPath>`
              : `<clipPath id="${clipId}">${borderPathRect}</clipPath>`
          }
        </defs>
    `;

    // Group with clip to ensure no overflow outside stamp bounds
    svgContent += `<g clip-path="url(#${clipId})">`;

    // Draw logo (if any)
    if (design.includeLogo && design.logoImage) {
      const size = Math.min(widthPx, heightPx) * 0.2;
      const x = cx - size / 2 + (design.logoX / 100) * (widthPx * 0.2);
      const y = cy - size / 2 + (design.logoY / 100) * (heightPx * 0.2);
      svgContent += `<image href="${design.logoImage}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" />`;
    }

    // Render text lines
    const escapeXml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    design.lines.forEach((line) => {
      if (!line.text?.trim() || line.visible === false) return;

      // Resolve font and spacing (prefer mm fields)
      const fontPx = line.fontSizeMm ? mmToPx(line.fontSizeMm) : (line.fontSize || 16);
      const letterSpacingPx = line.letterSpacingMm ? mmToPx(line.letterSpacingMm) : (line.letterSpacing || 0);
      const fontWeight = line.bold ? 'bold' : (line as any).fontWeight || 'normal';
      const fontStyle = line.italic ? 'italic' : (line as any).fontStyle || 'normal';
      const fontFamily = line.fontFamily || 'Arial';

      if (line.curved) {
        const centerX = line.axisXMm != null ? clamp(mmToPx(line.axisXMm), margin, widthPx - margin) : cx;
        const centerY = line.axisYMm != null ? clamp(mmToPx(line.axisYMm), margin, heightPx - margin) : cy;
        const radiusPx = line.radiusMm != null ? Math.max(0, mmToPx(line.radiusMm)) : Math.min(widthPx, heightPx) * 0.35;
        const arcDegrees = line.arcDeg ?? 180;
        const align = (line.curvedAlign as any) || 'center';
        const direction = (line.direction as any) || 'outside';
        const rotationDeg = line.rotationDeg || 0;

        const poses = layoutArc({
          text: line.text,
          fontFamily,
          fontWeight,
          fontStyle,
          fontSizePx: fontPx,
          letterSpacingPx,
          centerX,
          centerY,
          radiusPx,
          arcDegrees,
          align,
          direction,
          rotationDeg,
        });

        poses.forEach((g) => {
          const deg = (g.angleRad * 180) / Math.PI;
          svgContent += `
            <text x="${g.x}" y="${g.y}"
              fill="${line.color || design.inkColor}"
              font-family="${fontFamily}"
              font-size="${fontPx}"
              font-weight="${fontWeight}"
              font-style="${fontStyle}"
              text-anchor="middle"
              dominant-baseline="middle"
              transform="rotate(${deg} ${g.x} ${g.y})"
              ${letterSpacingPx ? `letter-spacing="${letterSpacingPx}"` : ''}
            >${escapeXml(g.char)}</text>`;
        });
      } else {
        const textAnchor = line.alignment === 'left' ? 'start' : line.alignment === 'right' ? 'end' : 'middle';
        const baseline = (line.baseline as any) || 'alphabetic';
        const x = line.xMm != null ? clamp(mmToPx(line.xMm), margin, widthPx - margin) : clamp(cx + ((line.xPosition || 0) / 100) * (widthPx / 2), margin, widthPx - margin);
        const y = line.yMm != null ? clamp(mmToPx(line.yMm), margin, heightPx - margin) : clamp(cy + ((line.yPosition || 0) / 100) * (heightPx / 2), margin, heightPx - margin);
        svgContent += `
          <text x="${x}" y="${y}"
            fill="${line.color || design.inkColor}"
            font-family="${fontFamily}"
            font-size="${fontPx}"
            font-weight="${fontWeight}"
            font-style="${fontStyle}"
            text-anchor="${textAnchor}"
            dominant-baseline="${baseline}"
            ${letterSpacingPx ? `letter-spacing="${letterSpacingPx}"` : ''}
          >${escapeXml(line.text)}</text>`;
      }
    });

    // Close clipped group
    svgContent += `</g>`;

    // Draw border on top (outside clip so it isn't clipped away)
    const borderStroke = `stroke=\"${design.inkColor}\" stroke-width=\"${design.borderThickness || strokePx}\"`;
    if (design.borderStyle && design.borderStyle !== 'none') {
      switch (design.shape) {
        case 'circle': {
          const dash = design.borderStyle === 'dashed' ? ' stroke-dasharray="8,4"' : design.borderStyle === 'dotted' ? ' stroke-dasharray="3,3"' : '';
          svgContent += `<circle cx="${cx}" cy="${cy}" r="${Math.min(widthPx, heightPx) / 2 - margin}" ${borderStroke}${dash} fill="none"/>`;
          if (design.borderStyle === 'double') {
            svgContent += `<circle cx="${cx}" cy="${cy}" r="${Math.min(widthPx, heightPx) / 2 - margin - mmToPx(2)}" ${borderStroke} fill="none"/>`;
          }
          break;
        }
        case 'ellipse': {
          const dash = design.borderStyle === 'dashed' ? ' stroke-dasharray="8,4"' : design.borderStyle === 'dotted' ? ' stroke-dasharray="3,3"' : '';
          svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${widthPx / 2 - margin}" ry="${heightPx / 2 - margin}" ${borderStroke}${dash} fill="none"/>`;
          if (design.borderStyle === 'double') {
            svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${widthPx / 2 - margin - mmToPx(2)}" ry="${heightPx / 2 - margin - mmToPx(2)}" ${borderStroke} fill="none"/>`;
          }
          break;
        }
        default: {
          const dash = design.borderStyle === 'dashed' ? ' stroke-dasharray="8,4"' : design.borderStyle === 'dotted' ? ' stroke-dasharray="3,3"' : '';
          svgContent += `<rect x="${margin}" y="${margin}" width="${widthPx - 2 * margin}" height="${heightPx - 2 * margin}" ${borderStroke}${dash} fill="none"/>`;
          if (design.borderStyle === 'double') {
            const off = mmToPx(2);
            svgContent += `<rect x="${margin + off}" y="${margin + off}" width="${widthPx - 2 * (margin + off)}" height="${heightPx - 2 * (margin + off)}" ${borderStroke} fill="none"/>`;
          }
        }
      }
    }

    svgContent += `</svg>`;

    const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    svgRef.current = svgContent;
    setPreviewImage(previewUrl);
    return previewUrl;
  };

  // Download preview as PNG with exact stamp size and transparent background (HiDPI-aware)
  const downloadAsPng = () => {
    if (!product) return;

    // Exact pixel size from mm at 10 px/mm
    const { widthPx, heightPx } = sizePx(product.size);
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Create canvas and context with alpha for transparency
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(widthPx * dpr);
    canvas.height = Math.round(heightPx * dpr);
    canvas.style.width = `${widthPx}px`;
    canvas.style.height = `${heightPx}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Scale for device pixel ratio and clear to keep transparency
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, widthPx, heightPx);

    // Helpers
    const margin = mmToPx(1.0);
    const strokePx = Math.max(1, mmToPx(0.4));

    const beginBorderPath = () => {
      ctx.beginPath();
      switch (design.shape) {
        case 'circle': {
          const r = Math.min(widthPx, heightPx) / 2 - margin;
          ctx.arc(widthPx / 2, heightPx / 2, r, 0, Math.PI * 2);
          break;
        }
        case 'ellipse': {
          ctx.ellipse(widthPx / 2, heightPx / 2, widthPx / 2 - margin, heightPx / 2 - margin, 0, 0, Math.PI * 2);
          break;
        }
        default: {
          ctx.rect(margin, margin, widthPx - 2 * margin, heightPx - 2 * margin);
        }
      }
    };

    // Clip to stamp shape so nothing bleeds outside
    ctx.save();
    beginBorderPath();
    ctx.clip();

    // Draw text lines
    const drawStraight = (line: StampTextLine) => {
      const fontPx = line.fontSizeMm ? mmToPx(line.fontSizeMm) : (line.fontSize || 16);
      const letterSpacingPx = line.letterSpacingMm ? mmToPx(line.letterSpacingMm) : (line.letterSpacing || 0);
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      const fontFamily = line.fontFamily || 'Arial';
      ctx.font = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;
      ctx.fillStyle = line.color || design.inkColor;
      ctx.textAlign = (line.alignment || 'center') as CanvasTextAlign;
      ctx.textBaseline = (line.baseline || 'alphabetic') as CanvasTextBaseline;

      const xRaw = line.xMm != null ? mmToPx(line.xMm) : (widthPx / 2 + ((line.xPosition || 0) / 100) * (widthPx / 2));
      const yRaw = line.yMm != null ? mmToPx(line.yMm) : (heightPx / 2 + ((line.yPosition || 0) / 100) * (heightPx / 2));
      const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
      const x = clamp(xRaw, margin, widthPx - margin);
      const y = clamp(yRaw, margin, heightPx - margin);

      if (letterSpacingPx > 0) {
        const chars = Array.from(line.text);
        const totalWidth = chars.reduce((acc, ch) => acc + ctx.measureText(ch).width, 0) + (chars.length - 1) * letterSpacingPx;
        let currentX = x;
        if (ctx.textAlign === 'center') currentX = x - totalWidth / 2;
        if (ctx.textAlign === 'right' || ctx.textAlign === 'end') currentX = x - totalWidth;
        chars.forEach((ch) => {
          ctx.fillText(ch, currentX, y);
          currentX += ctx.measureText(ch).width + letterSpacingPx;
        });
      } else {
        ctx.fillText(line.text, x, y);
      }
    };

    const drawCurved = (line: StampTextLine) => {
      const fontPx = line.fontSizeMm ? mmToPx(line.fontSizeMm) : (line.fontSize || 16);
      const letterSpacingPx = line.letterSpacingMm ? mmToPx(line.letterSpacingMm) : (line.letterSpacing || 0);
      const fontWeight = line.bold ? 'bold' : 'normal';
      const fontStyle = line.italic ? 'italic' : 'normal';
      const fontFamily = line.fontFamily || 'Arial';
      const font = `${fontStyle} ${fontWeight} ${fontPx}px ${fontFamily}`;

      const centerX = line.axisXMm != null ? mmToPx(line.axisXMm) : widthPx / 2;
      const centerY = line.axisYMm != null ? mmToPx(line.axisYMm) : heightPx / 2;
      const radiusPx = line.radiusMm != null ? Math.max(0, mmToPx(line.radiusMm)) : Math.min(widthPx, heightPx) * 0.35;
      const arcDegrees = line.arcDeg ?? 180;
      const align = line.curvedAlign || 'center';
      const direction = line.direction || 'outside';
      const rotationDeg = line.rotationDeg || 0;

      const poses = layoutArc({
        text: line.text,
        fontFamily,
        fontWeight,
        fontStyle,
        fontSizePx: fontPx,
        letterSpacingPx,
        centerX,
        centerY,
        radiusPx,
        arcDegrees,
        align,
        direction,
        rotationDeg,
      });

      drawCurvedText(ctx, poses, { font, fillStyle: line.color || design.inkColor });
    };

    design.lines.forEach((line) => {
      if (!line.text.trim() || line.visible === false) return;
      if (line.curved) drawCurved(line); else drawStraight(line);
    });

    // Restore after clip
    ctx.restore();

    // Draw border on top (no fill to keep transparent)
    if (design.borderStyle !== 'none') {
      ctx.save();
      ctx.strokeStyle = design.inkColor;
      ctx.lineWidth = design.borderThickness || strokePx;
      // dashed/dotted/double
      const drawOnce = (offsetMm = 0) => {
        ctx.beginPath();
        const extra = mmToPx(offsetMm);
        switch (design.shape) {
          case 'circle':
            ctx.arc(widthPx / 2, heightPx / 2, Math.min(widthPx, heightPx) / 2 - (margin + extra), 0, Math.PI * 2);
            break;
          case 'ellipse':
            ctx.ellipse(widthPx / 2, heightPx / 2, widthPx / 2 - (margin + extra), heightPx / 2 - (margin + extra), 0, 0, Math.PI * 2);
            break;
          default:
            ctx.rect(margin + extra, margin + extra, widthPx - 2 * (margin + extra), heightPx - 2 * (margin + extra));
        }
        ctx.stroke();
      };

      switch (design.borderStyle) {
        case 'dashed':
          ctx.setLineDash([8, 4]);
          drawOnce();
          break;
        case 'dotted':
          ctx.setLineDash([3, 3]);
          drawOnce();
          break;
        case 'double':
          ctx.setLineDash([]);
          const lw = ctx.lineWidth;
          ctx.lineWidth = Math.max(1, lw / 3);
          drawOnce();
          drawOnce(2);
          break;
        default:
          ctx.setLineDash([]);
          drawOnce();
      }
      ctx.restore();
    }

    const finish = () => {
      const link = document.createElement('a');
      link.download = `${product.name.replace(/\s/g, '-')}-stamp-${widthPx}x${heightPx}px.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    // Optional: draw logo (async-safe)
    if (design.includeLogo && design.logoImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Place logo roughly at center with percentage offsets
        const size = Math.min(widthPx, heightPx) * 0.2;
        const x = widthPx / 2 - size / 2 + (design.logoX / 100) * (widthPx * 0.2);
        const y = heightPx / 2 - size / 2 + (design.logoY / 100) * (heightPx * 0.2);

        // Draw inside clip
        ctx.save();
        beginBorderPath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();

        finish();
      };
      img.onerror = finish;
      img.src = design.logoImage;
    } else {
      finish();
    }
  };

  return {
    design,
    updateLine,
    setGlobalAlignment,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    setBorderStyle,
    setBorderThickness,
    toggleCurvedText: (index: number, textPosition: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
      console.log('[StampDesigner] toggleCurvedText', { index, textPosition });
      const current = design.lines[index];
      updateLine(index, {
        curved: !current.curved,
        textPosition: textPosition
      });
    },
    updateTextPosition: (index: number, x: number, y: number) => {
      console.log('[StampDesigner] updateTextPosition', { index, x, y });
      // Constrain the movement within -100 to 100 range
      const constrainedX = Math.max(-100, Math.min(100, x));
      const constrainedY = Math.max(-100, Math.min(100, y));

      const newLines = [...design.lines];
      newLines[index] = {
        ...newLines[index],
        xPosition: constrainedX,
        yPosition: constrainedY
      };

      const updatedDesign = { ...design, lines: newLines };
      setHistory(prev => ({
        ...prev,
        present: updatedDesign
      }));
    },
    updateLogoPosition: (x: number, y: number) => {
      console.log('[StampDesigner] updateLogoPosition', { x, y });
      // Constrain the movement within -100 to 100 range
      const constrainedX = Math.max(-100, Math.min(100, x));
      const constrainedY = Math.max(-100, Math.min(100, y));

      const updatedDesign = {
        ...design,
        logoX: constrainedX,
        logoY: constrainedY
      };

      setHistory(prev => ({
        ...prev,
        present: updatedDesign
      }));
    },
    startTextDrag: (index: number) => {
      console.log('[StampDesigner] startTextDrag', index);
      const newLines = [...design.lines];
      newLines.forEach((line, i) => {
        line.isDragging = i === index;
      });

      setHistory(prev => ({
        ...prev,
        present: { ...design, lines: newLines, logoDragging: false }
      }));
    },
    startLogoDrag: () => {
      console.log('[StampDesigner] startLogoDrag');
      const newLines = [...design.lines];
      newLines.forEach(line => {
        line.isDragging = false;
      });

      setHistory(prev => ({
        ...prev,
        present: { ...design, lines: newLines, logoDragging: true }
      }));
    },
    stopDragging: () => {
      console.log('[StampDesigner] stopDragging');
      const newLines = [...design.lines];
      newLines.forEach(line => {
        line.isDragging = false;
      });

      const updatedDesign = { ...design, lines: newLines, logoDragging: false };
      updateHistory(updatedDesign);
    },
    handleDrag: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, previewRect: DOMRect) => {
      // Get mouse/touch position relative to preview area
      let clientX: number, clientY: number;

      if ('touches' in e) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const centerX = previewRect.left + previewRect.width / 2;
      const centerY = previewRect.top + previewRect.height / 2;

      // Calculate position as percentage from center (-100 to 100)
      const relativeX = ((clientX - centerX) / (previewRect.width / 2)) * 100;
      const relativeY = ((clientY - centerY) / (previewRect.height / 2)) * 100;

      // Update the position of the dragging element
      const draggingLineIndex = design.lines.findIndex(line => line.isDragging);

      if (draggingLineIndex !== -1) {
        // Update text position
        console.log('[StampDesigner] handleDrag - text line', draggingLineIndex, { relativeX, relativeY });
        const newLines = [...design.lines];
        newLines[draggingLineIndex] = {
          ...newLines[draggingLineIndex],
          xPosition: relativeX,
          yPosition: relativeY
        };

        setHistory(prev => ({
          ...prev,
          present: { ...design, lines: newLines }
        }));
      } else if (design.logoDragging && design.includeLogo) {
        // Update logo position
        console.log('[StampDesigner] handleDrag - logo', { relativeX, relativeY });
        setHistory(prev => ({
          ...prev,
          present: {
            ...design,
            logoX: relativeX,
            logoY: relativeY
          }
        }));
      }
    },
    previewImage,
    generatePreview,
    validateDesign: (step: string): string[] => {
      const errors: string[] = [];

      if (step === 'text') {
        // Check if at least one line has text
        const hasText = design.lines.some(line => line.text.trim().length > 0);
        if (!hasText) {
          errors.push('Add at least one line of text to your stamp');
        }

        // Check for lines that are too long
        design.lines.forEach((line, index) => {
          if (line.text.length > 30) {
            errors.push(`Line ${index + 1} is too long. Keep it under 30 characters for better readability.`);
          }
        });
      }

      if (step === 'logo' && design.includeLogo && !design.logoImage) {
        errors.push('Please upload a logo image or disable the logo option');
      }

      if (step === 'preview') {
        // Final validation before adding to cart
        const hasText = design.lines.some(line => line.text.trim().length > 0);
        if (!hasText) {
          errors.push('Your stamp needs at least one line of text');
        }

        if (design.includeLogo && !design.logoImage) {
          errors.push('Logo option is enabled but no logo has been uploaded');
        }
      }

      return errors;
    },
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    loadDesign,
    hasSavedDesign,
    clearSavedDesign,
    applyTemplate,
    zoomIn,
    zoomOut,
    zoomLevel,
    svgRef,
    addElement,
    downloadAsPng,
    updateMultipleLines,
    enhancedAutoArrange
  };
};

export default useStampDesignerEnhanced;
