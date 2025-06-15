import { useState, useEffect, useRef } from 'react';
import { StampDesign, StampTextLine, Product, StampElement } from '../types';
import { useCanvasCentering } from './useCanvasCentering';

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
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center',
    curved: false,
    xPosition: 0,
    yPosition: 0,
    isDragging: false,
    letterSpacing: 0,
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
      lines.push({ ...defaultLine });
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
    borderStyle: 'single',
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

  // --- [2] Only center content when product changes ---
  useEffect(() => {
    if (product) {
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product.size);
      const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
      const centeredLines = centerTextGroup(
        initializeLines(),
        canvasWidth,
        canvasHeight,
        baseFontSize,
        design.globalAlignment || 'center'
      );
      const updatedDesign = {
        ...design,
        lines: centeredLines,
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: detectShape(product)
      };

      setHistory({
        past: [],
        present: updatedDesign,
        future: []
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // --- [3] Keep preview generation in effect, but only update preview image (not lines positions) ---
  useEffect(() => {
    if (product) {
      generatePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design, product]);

  // Helper function to update history when design changes
  const updateHistory = (updatedDesign: StampDesign) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedDesign,
      future: []
    }));
  };

  // Update text line with history tracking and auto-centering
  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    newLines[index] = { ...newLines[index], ...updates };

    // Auto-center after update
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(product?.size || '38x14mm');
    const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
    const centeredLines = centerTextGroup(
      newLines,
      canvasWidth,
      canvasHeight,
      baseFontSize,
      design.globalAlignment || 'center'
    );

    const updatedDesign = { ...design, lines: centeredLines };
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
        lines: [...design.lines, { ...defaultLine }]
      };
      updateHistory(updatedDesign);
    }
  };

  // Remove line with history tracking
  const removeLine = (index: number) => {
    const newLines = design.lines.filter((_, i) => i !== index);
    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };

  // Set ink color with history tracking
  const setInkColor = (color: string) => {
    const updatedDesign = { ...design, inkColor: color };
    updateHistory(updatedDesign);
  };

  // Toggle logo inclusion with history tracking
  const toggleLogo = () => {
    const updatedDesign = { ...design, includeLogo: !design.includeLogo };
    updateHistory(updatedDesign);
  };

  // Set logo position with history tracking
  const setLogoPosition = (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    const updatedDesign = { ...design, logoPosition: position };
    updateHistory(updatedDesign);
  };

  // Set logo image with history tracking
  const setLogoImage = (imageUrl: string) => {
    const updatedDesign = { ...design, logoImage: imageUrl };
    updateHistory(updatedDesign);
  };

  // Set border style with history tracking
  const setBorderStyle = (style: 'single' | 'double' | 'wavy' | 'none') => {
    const updatedDesign = { ...design, borderStyle: style };
    updateHistory(updatedDesign);
  };

  // Set border thickness with history tracking
  const setBorderThickness = (thickness: number) => {
    const updatedDesign = { ...design, borderThickness: thickness };
    updateHistory(updatedDesign);
  };

  // Toggle curved text with history tracking
  const toggleCurvedText = (index: number, textPosition: 'top' | 'bottom' | 'left' | 'right' = 'top') => {
    const current = design.lines[index];
    updateLine(index, {
      curved: !current.curved,
      textPosition: textPosition
    });
  };

  // Update text position with history tracking
  const updateTextPosition = (index: number, x: number, y: number) => {
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
      return true;
    } catch (error) {
      console.error('Error clearing saved design:', error);
      return false;
    }
  };

  // Apply a template to the current design
  const applyTemplate = (template: Partial<StampDesign>) => {
    if (!template) return;

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
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
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

  // --- [4] Enhanced auto-arrange: still uses centering when user clicks auto-arrange ---
  const enhancedAutoArrange = () => {
    const lines = [...design.lines];
    const nonEmptyLines = lines.filter(l => l.text.trim().length > 0);
    if (nonEmptyLines.length === 0) return;

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
    const centeredLines = centerTextGroup(
      lines,
      canvasWidth,
      canvasHeight,
      baseFontSize,
      design.globalAlignment || 'center'
    );

    updateMultipleLines(centeredLines);
  };

  // Generate preview image with perfect centering
  const generatePreview = (): string => {
    if (!product) {
      return '';
    }

    // Parse dimensions from product.size (format: "38x14mm" -> 380x140 px at 10px per mm)
    const sizeDimensions = product.size.replace('mm', '').split('x').map(dim => parseInt(dim.trim(), 10));
    let canvasWidth = 380; // Default for 38mm at 10px per mm
    let canvasHeight = 140; // Default for 14mm at 10px per mm

    if (sizeDimensions.length === 2) {
      // Convert mm to pixels at 10 pixels per mm for exact real-world size
      canvasWidth = sizeDimensions[0] * 10;
      canvasHeight = sizeDimensions[1] * 10;
    }

    // Calculate true center coordinates
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Create SVG with exact stamp dimensions
    let svgContent = `
      <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs></defs>
        <rect width="100%" height="100%" fill="transparent"/>
    `;

    // Add shape-specific borders and content with precise centering
    if (design.shape === 'ellipse') {
      const rx = (canvasWidth / 2) - 10; // Padding from edges
      const ry = (canvasHeight / 2) - 10;

      // Add borders
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `<ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `
          <ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <ellipse cx="${centerX}" cy="${centerY}" rx="${rx-8}" ry="${ry-8}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      }

      // Add logo with precise centering
      if (design.includeLogo && design.logoImage) {
        const logoSize = Math.min(rx, ry) * 0.3;
        const logoX = centerX - logoSize/2 + (design.logoX / 100) * (rx * 0.3);
        const logoY = centerY - logoSize/2 + (design.logoY / 100) * (ry * 0.3);
        svgContent += `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
      }

      // Render text with canvas-based positioning
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;
        
        const baseFontSize = Math.min(canvasWidth, canvasHeight) / 15;
        const fontSize = (line.fontSize / 16) * baseFontSize;

        // Convert percentage positions back to canvas coordinates
        const textX = centerX + (line.xPosition / 100) * (canvasWidth / 2);
        const textY = centerY + (line.yPosition / 100) * (canvasHeight / 2);

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          const textRadius = Math.min(rx, ry) * 0.7;
          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs><ellipse id="${pathId}" cx="${centerX}" cy="${centerY}" rx="${textRadius}" ry="${textRadius * (ry/rx)}" /></defs>`;
          
          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${fontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="50%">
                  ${line.text}
                </textPath>
              </text>
            </g>`;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${fontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="50%">
                ${line.text}
              </textPath>
            </text>`;
          }
        } else {
          let textAnchor = 'middle';
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';

          svgContent += `
            <text x="${textX}" y="${textY + fontSize/3}" 
                  font-family="${line.fontFamily}" 
                  font-size="${fontSize}" 
                  text-anchor="${textAnchor}" 
                  fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''}>
              ${line.text}
            </text>`;
        }
      });

    } else if (design.shape === 'circle') {
      const radius = Math.min(centerX, centerY) - 10;

      // Add borders
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 8}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      }

      // Add logo with precise centering
      if (design.includeLogo && design.logoImage) {
        const logoSize = radius * 0.3;
        const logoX = centerX - logoSize/2 + (design.logoX / 100) * (radius * 0.3);
        const logoY = centerY - logoSize/2 + (design.logoY / 100) * (radius * 0.3);
        svgContent += `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
      }

      // Render text with canvas-based positioning
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;
        
        const baseFontSize = radius / 8;
        const fontSize = (line.fontSize / 16) * baseFontSize;

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          const textRadius = radius * 0.7;
          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs>`;
          if (isBottom) {
            svgContent += `<path id="${pathId}" d="M ${centerX + textRadius} ${centerY} a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0" />`;
          } else {
            svgContent += `<path id="${pathId}" d="M ${centerX - textRadius} ${centerY} a ${textRadius},${textRadius} 0 1,0 ${textRadius * 2},0" />`;
          }
          svgContent += `</defs>`;

          const startOffset = 50 + (line.xPosition / 100) * 25;

          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${fontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="${100 - startOffset}%">
                  ${line.text}
                </textPath>
              </text>
            </g>`;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${fontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${startOffset}%">
                ${line.text}
              </textPath>
            </text>`;
          }
        } else {
          // Straight text - perfectly centered with proper vertical distribution
          const nonEmptyLines = design.lines.filter(l => !l.curved && l.text.trim());
          const lineIndex = nonEmptyLines.findIndex(l => l === line);
          
          let textY = centerY + fontSize/3;
          if (nonEmptyLines.length > 1) {
            const totalHeight = (nonEmptyLines.length - 1) * fontSize * 1.2;
            const startY = centerY - totalHeight / 2 + fontSize/3;
            textY = startY + lineIndex * fontSize * 1.2;
          }
          
          const textX = centerX + (line.xPosition / 100) * (radius * 0.4);
          textY += (line.yPosition / 100) * (radius * 0.4);
          
          svgContent += `
            <text x="${textX}" y="${textY}"
                  font-family="${line.fontFamily}"
                  font-size="${fontSize}"
                  text-anchor="middle"
                  fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''}
                  ${line.italic ? 'font-style="italic"' : ''}>
              ${line.text}
            </text>`;
        }
      });

    } else {
      // Rectangular stamps with precise centering
      const padding = 10;
      
      // Add borders
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `<rect x="${padding}" y="${padding}" width="${canvasWidth - padding*2}" height="${canvasHeight - padding*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 2;
        svgContent += `
          <rect x="${padding}" y="${padding}" width="${canvasWidth - padding*2}" height="${canvasHeight - padding*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <rect x="${padding + 8}" y="${padding + 8}" width="${canvasWidth - (padding + 8)*2}" height="${canvasHeight - (padding + 8)*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      }

      // Add logo with precise centering
      if (design.includeLogo && design.logoImage) {
        const logoSize = Math.min(canvasWidth, canvasHeight) * 0.2;
        const logoX = centerX - logoSize/2 + (design.logoX / 100) * (canvasWidth * 0.2);
        const logoY = centerY - logoSize/2 + (design.logoY / 100) * (canvasHeight * 0.2);
        svgContent += `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
      }

      // Render text with canvas-based positioning
      const nonEmptyLines = design.lines.filter(l => !l.curved && l.text.trim());
      const baseFontSize = Math.min(canvasWidth, canvasHeight) / 12;
      
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;
        
        const fontSize = (line.fontSize / 16) * baseFontSize;

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          const radiusX = (canvasWidth / 2) * 0.7;
          const radiusY = (canvasHeight / 2) * 0.5;
          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs>`;
          if (isBottom) {
            svgContent += `<path id="${pathId}" d="M ${centerX + radiusX} ${centerY} a ${radiusX},${radiusY} 0 1,1 -${radiusX * 2},0" />`;
          } else {
            svgContent += `<path id="${pathId}" d="M ${centerX - radiusX} ${centerY} a ${radiusX},${radiusY} 0 1,0 ${radiusX * 2},0" />`;
          }
          svgContent += `</defs>`;

          const startOffset = 50 + (line.xPosition / 100) * 25;

          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${fontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="${100 - startOffset}%">
                  ${line.text}
                </textPath>
              </text>
            </g>`;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${fontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${startOffset}%">
                ${line.text}
              </textPath>
            </text>`;
          }
        } else {
          let textAnchor = 'middle';
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';

          // Convert percentage positions back to canvas coordinates
          const textX = centerX + (line.xPosition / 100) * (canvasWidth / 2);
          const textY = centerY + (line.yPosition / 100) * (canvasHeight / 2);

          svgContent += `
            <text x="${textX}" y="${textY + fontSize/3}" 
                  font-family="${line.fontFamily}" 
                  font-size="${fontSize}" 
                  text-anchor="${textAnchor}" 
                  fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''}>
              ${line.text}
            </text>`;
        }
      });
    }

    // Add custom elements (QR codes, barcodes, etc.) - centered
    if (design.elements && design.elements.length > 0) {
      design.elements.forEach((element) => {
        const elementX = centerX + (element.x / 100) * (canvasWidth / 4) - element.width / 2;
        const elementY = centerY + (element.y / 100) * (canvasHeight / 4) - element.height / 2;

        svgContent += `
          <image href="${element.dataUrl}" x="${elementX}" y="${elementY}" 
                width="${element.width}" height="${element.height}" 
                preserveAspectRatio="xMidYMid meet" />
        `;
      });
    }

    // Close the SVG
    svgContent += `</svg>`;

    const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    // Store the SVG content as a string
    svgRef.current = svgContent;
    setPreviewImage(previewUrl);
    return previewUrl;
  };

  // Download preview as PNG with exact stamp size and transparent background
  const downloadAsPng = () => {
    if (!svgRef.current || !product) return;

    // Create a canvas element with exact stamp dimensions
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    // Parse dimensions and convert to pixels at 10px per mm for real-world accuracy
    const sizeDimensions = product.size.replace('mm', '').split('x').map(dim => parseInt(dim.trim(), 10));
    let canvasWidth = 380; // Default for 38mm
    let canvasHeight = 140; // Default for 14mm

    if (sizeDimensions.length === 2) {
      canvasWidth = sizeDimensions[0] * 10;
      canvasHeight = sizeDimensions[1] * 10;
    }

    // Set canvas dimensions to exact stamp size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create an image from the SVG
    const img = new Image();
    // Create a blob from the SVG string
    const svgBlob = new Blob([svgRef.current], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Clear canvas (transparent background)
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image to canvas without background (preserves transparency)
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Create download link
      const link = document.createElement('a');
      link.download = `${product.name.replace(/\s/g, '-')}-stamp-${canvasWidth}x${canvasHeight}px.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load SVG for PNG export');
      URL.revokeObjectURL(url);
    };

    img.src = url;
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
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    generatePreview,
    validateDesign,
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
