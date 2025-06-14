import { useState, useEffect, useRef } from 'react';
import { StampDesign, StampTextLine, Product, StampElement } from '../types';

interface DesignHistoryState {
  past: StampDesign[];
  present: StampDesign;
  future: StampDesign[];
}

// Main hook function
const useStampDesignerEnhanced = (product: Product | null) => {
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
    shape: detectShape(product), // Use detectShape (handles oval)
    borderStyle: 'single',
    borderThickness: 1,
    elements: [] // Add elements array for QR codes, barcodes, etc.
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
  // Store the SVG content as a string, not as an SVGSVGElement
  const svgRef = useRef<string | null>(null);

  // Update design when product changes
  useEffect(() => {
    if (product) {
      const updatedDesign = {
        ...design,
        lines: initializeLines(),
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: detectShape(product) // For trodat-44055, force 'ellipse'
      };

      // Update history with new design but don't track this as a user action
      setHistory({
        past: [],
        present: updatedDesign,
        future: []
      });
    }
  }, [product]);

  // Auto-generate preview whenever design changes
  useEffect(() => {
    if (product) {
      generatePreview();
    }
  }, [design, product]);

  // Helper function to update history when design changes
  const updateHistory = (updatedDesign: StampDesign) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedDesign,
      future: []
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

  // Update text line with history tracking
  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    newLines[index] = { ...newLines[index], ...updates };

    const updatedDesign = { ...design, lines: newLines };
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

  // --- ENHANCED AUTO-ARRANGE FUNCTION ---
  /**
   * intelligent, shape/content aware auto layout
   */
  const enhancedAutoArrange = () => {
    const lines = [...design.lines];
    const nonEmptyLines = lines.filter(l => l.text.trim().length > 0);
    if (nonEmptyLines.length === 0) return;

    if (design.shape === 'circle') {
      // Split into perimeter (curved) and center lines
      const perimeterLines: StampTextLine[] = [];
      const centerLines: StampTextLine[] = [];

      nonEmptyLines.forEach((line, idx) => {
        // If curved or short, place on perimeter
        if (line.curved || line.text.length <= 15) {
          perimeterLines.push({ ...line, curved: true, textPosition: idx % 2 === 0 ? 'top' : 'bottom' });
        } else {
          centerLines.push({ ...line, curved: false, textPosition: 'top' });
        }
      });

      // Position perimeter lines evenly: first half top, second half bottom
      perimeterLines.forEach((l, idx) => {
        const isTop = l.textPosition === 'top';
        // Alternate Y for visual evenness (adapt as needed)
        l.yPosition = isTop ? -70 : 70;
        l.xPosition = 0;
        l.fontSize = Math.max(16, 28 - perimeterLines.length * 2);
        l.alignment = 'center';
        l.textPosition = isTop ? 'top' : 'bottom';
      });
      // Center lines in middle
      centerLines.forEach((l, idx) => {
        const centerCount = centerLines.length;
        const mid = (centerCount - 1) / 2;
        l.yPosition = (idx - mid) * 14;
        l.xPosition = 0;
        l.fontSize = Math.max(14, 22 - centerCount);
        l.alignment = 'center';
        l.textPosition = 'top';
      });
      // Merge
      const arranged = [...perimeterLines, ...centerLines];
      // Fill up to lines.length to prevent index error
      const result = arranged.concat(lines.slice(arranged.length).map(l => ({ ...l, text: '' })));
      updateMultipleLines(result.slice(0, lines.length));
    } else {
      // Rectangular/square: stack all vertically, centered
      nonEmptyLines.forEach((l, idx) => {
        l.xPosition = 0;
        const total = nonEmptyLines.length;
        l.yPosition = ((idx + 1) - (total + 1) / 2) * 20;
        l.alignment = 'center';
        l.curved = false;
        l.textPosition = 'top';
        l.fontSize = Math.max(14, 20 - total);
      });
      // Merge and fill as above
      const arranged = [...nonEmptyLines, ...lines.slice(nonEmptyLines.length).map(l => ({ ...l, text: '' }))];
      updateMultipleLines(arranged.slice(0, lines.length));
    }
  };

  // Generate preview image - FIXED CENTERING FOR ALL SHAPES
  const generatePreview = (): string => {
    if (!product) {
      return '';
    }

    // Parse dimensions from product.size (format: "48x18mm" -> width x height)
    const sizeDimensions = product.size.replace('mm', '').split('x').map(dim => parseInt(dim.trim(), 10));
    let displayWidth = 300;
    let displayHeight = 200;

    // Calculate SVG display dimensions maintaining aspect ratio
    if (sizeDimensions.length === 2) {
      const [productWidth, productHeight] = sizeDimensions;
      const aspectRatio = productWidth / productHeight;
      
      // Set consistent base size and scale proportionally
      if (design.shape === 'circle') {
        const diameter = Math.max(productWidth, productHeight);
        displayWidth = displayHeight = 300;
      } else if (design.shape === 'ellipse') {
        displayWidth = 300;
        displayHeight = Math.round(300 / aspectRatio);
      } else {
        // Rectangle/square
        displayWidth = 300;
        displayHeight = Math.round(300 / aspectRatio);
      }
    }

    // ViewBox dimensions (actual stamp size) - CENTERED PROPERLY
    const viewWidth = sizeDimensions[0] || 60;
    const viewHeight = sizeDimensions[1] || 40;
    
    // Calculate true center coordinates
    const centerX = viewWidth / 2;
    const centerY = viewHeight / 2;

    let svgContent = `
      <svg width="${displayWidth}" height="${displayHeight}" viewBox="0 0 ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
        </defs>
        <rect width="100%" height="100%" fill="white"/>
    `;

    // --- ELLIPSE SHAPE SUPPORT - PROPERLY CENTERED ---
    if (design.shape === 'ellipse') {
      const rx = centerX - 1; // Full radius minus border space
      const ry = centerY - 1;

      // Borders - centered around true center
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `
          <ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <ellipse cx="${centerX}" cy="${centerY}" rx="${rx-2}" ry="${ry-2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      } else if (design.borderStyle === 'wavy') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<ellipse cx="${centerX}" cy="${centerY}" rx="${rx}" ry="${ry}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none" stroke-dasharray="2,1"/>`;
      }

      // Add logo if included - centered with offset
      if (design.includeLogo && design.logoImage) {
        const logoSize = Math.min(rx, ry) * 0.4;
        const logoX = centerX - logoSize/2 + (design.logoX || 0) / 100 * (rx * 0.4);
        const logoY = centerY - logoSize/2 + (design.logoY || 0) / 100 * (ry * 0.4);
        svgContent += `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
      }

      // Render text for ellipse - properly centered
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;
        const scaledFontSize = Math.min(rx, ry) / 6;

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          
          const baseRadius = Math.min(rx, ry) * 0.7;
          const radiusAdjustment = (line.yPosition || 0) / 100 * (Math.min(rx, ry) * 0.2);
          const textPathRadius = Math.max(10, baseRadius + radiusAdjustment);

          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs>`;
          if (isBottom) {
            svgContent += `<ellipse id="${pathId}" cx="${centerX}" cy="${centerY}" rx="${textPathRadius}" ry="${textPathRadius * (ry/rx)}" />`;
          } else {
            svgContent += `<ellipse id="${pathId}" cx="${centerX}" cy="${centerY}" rx="${textPathRadius}" ry="${textPathRadius * (ry/rx)}" />`;
          }
          svgContent += `</defs>`;

          const letterSpacing = line.letterSpacing ? `${line.letterSpacing}px` : '0.5px';
          const baseStartOffset = 50;
          const arcPositionAdjustment = (line.xPosition || 0) / 100 * 25;
          const startOffset = baseStartOffset + arcPositionAdjustment;

          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}"
                    letter-spacing="${letterSpacing}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="${100 - startOffset}%">
                  ${line.text}
                </textPath>
              </text>
            </g>
            `;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}"
                  letter-spacing="${letterSpacing}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${startOffset}%">
                ${line.text}
              </textPath>
            </text>
            `;
          }
        } else {
          // Straight text for ellipse - centered at true center
          const x = centerX + (line.xPosition || 0) / 100 * rx * 0.4;
          const y = centerY + (line.yPosition || 0) / 100 * ry * 0.4;
          let textAnchor;
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';
          else textAnchor = 'middle';
          const letterSpacing = line.letterSpacing ? `letter-spacing="${line.letterSpacing}px"` : '';
          svgContent += `
            <text x="${x}" y="${y}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
              text-anchor="${textAnchor}" fill="${design.inkColor}"
              ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}
              ${letterSpacing}>
              ${line.text}
            </text>
          `;
        }
      });

    } else if (design.shape === 'circle') {
      // For circular stamps - centered around true center
      const radius = Math.min(centerX, centerY) - 1; // Full radius minus border space

      // Add borders - centered
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      } else if (design.borderStyle === 'wavy') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none" stroke-dasharray="2,1"/>`;
      }

      // Add logo if included - centered
      if (design.includeLogo) {
        const logoSize = radius * 0.4;
        const logoX = centerX - logoSize/2 + (design.logoX || 0) / 100 * (radius * 0.4);
        const logoY = centerY - logoSize/2 + (design.logoY || 0) / 100 * (radius * 0.4);

        if (design.logoImage) {
          svgContent += `
            <image href="${design.logoImage}" x="${logoX}" y="${logoY}" 
                   width="${logoSize}" height="${logoSize}" 
                   preserveAspectRatio="xMidYMid meet" />
          `;
        }
      }

      // Text rendering for circles - centered properly
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;

        const scaledFontSize = radius / 6;

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          
          const baseRadius = radius * 0.7;
          const radiusAdjustment = (line.yPosition || 0) / 100 * (radius * 0.2);
          const textPathRadius = Math.max(10, baseRadius + radiusAdjustment);

          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs>`;
          if (isBottom) {
            svgContent += `<path id="${pathId}" d="M ${centerX + textPathRadius} ${centerY} 
              a ${textPathRadius},${textPathRadius} 0 1,1 -${textPathRadius * 2},0" />`;
          } else {
            svgContent += `<path id="${pathId}" d="M ${centerX - textPathRadius} ${centerY} 
              a ${textPathRadius},${textPathRadius} 0 1,0 ${textPathRadius * 2},0" />`;
          }
          svgContent += `</defs>`;

          const letterSpacing = line.letterSpacing ? `${line.letterSpacing}px` : '0.5px';
          const baseStartOffset = 50;
          const arcPositionAdjustment = (line.xPosition || 0) / 100 * 25;
          const startOffset = baseStartOffset + arcPositionAdjustment;

          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}"
                    letter-spacing="${letterSpacing}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="${100 - startOffset}%">
                  ${line.text}
                </textPath>
              </text>
            </g>
            `;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}"
                  letter-spacing="${letterSpacing}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${startOffset}%">
                ${line.text}
              </textPath>
            </text>
            `;
          }
        } else {
          // Straight text for circles - centered with proper vertical spacing
          const nonEmptyLines = design.lines.filter(l => !l.curved && l.text.trim());
          const lineIndex = nonEmptyLines.findIndex(l => l === line);
          
          // Calculate vertical spacing for multiple lines
          let textY = centerY;
          if (nonEmptyLines.length > 1) {
            const totalSpacing = (nonEmptyLines.length - 1) * scaledFontSize * 1.2;
            const startY = centerY - totalSpacing / 2;
            textY = startY + lineIndex * scaledFontSize * 1.2;
          }
          
          const textX = centerX + (line.xPosition || 0) / 100 * radius * 0.4;
          textY += (line.yPosition || 0) / 100 * radius * 0.4;
          
          let textAnchor;
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';
          else textAnchor = 'middle';
          
          const letterSpacing = line.letterSpacing ? `letter-spacing="${line.letterSpacing}px"` : '';
          svgContent += `
            <text x="${textX}" y="${textY}"
                  font-family="${line.fontFamily}"
                  font-size="${scaledFontSize}"
                  text-anchor="${textAnchor}"
                  fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''}
                  ${line.italic ? 'font-style="italic"' : ''}
                  ${letterSpacing}>
              ${line.text}
            </text>
          `;
        }
      });
    } else {
      // For rectangular and square stamps - centered properly
      const borderOffset = 1; // Minimal border offset

      // Add border(s) - centered in viewbox
      if (design.borderStyle === 'single') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<rect x="${borderOffset}" y="${borderOffset}" width="${viewWidth - borderOffset*2}" height="${viewHeight - borderOffset*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `
          <rect x="${borderOffset}" y="${borderOffset}" width="${viewWidth - borderOffset*2}" height="${viewHeight - borderOffset*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
          <rect x="${borderOffset+2}" y="${borderOffset+2}" width="${viewWidth - (borderOffset+2)*2}" height="${viewHeight - (borderOffset+2)*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none"/>
        `;
      } else if (design.borderStyle === 'wavy') {
        const strokeWidth = design.borderThickness || 0.5;
        svgContent += `<rect x="${borderOffset}" y="${borderOffset}" width="${viewWidth - borderOffset*2}" height="${viewHeight - borderOffset*2}" stroke="${design.inkColor}" stroke-width="${strokeWidth}" fill="none" stroke-dasharray="2,1"/>`;
      }

      // Add logo if included - centered
      if (design.includeLogo) {
        const logoSize = Math.min(viewWidth, viewHeight) * 0.25;
        const logoX = centerX - logoSize / 2 + (design.logoX || 0) / 100 * (viewWidth / 4);
        const logoY = centerY - logoSize / 2 + (design.logoY || 0) / 100 * (viewHeight / 4);

        if (design.logoImage) {
          svgContent += `
            <image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />
          `;
        }
      }

      // Add text with curved text support for rectangles/squares - properly centered
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return;

        const scaledFontSize = Math.min(viewWidth, viewHeight) / 8;

        if (line.curved) {
          const pathId = `textPath${index}-${Math.random().toString(36).substr(2, 6)}`;
          
          const baseRadiusX = (viewWidth / 2) * 0.7;
          const baseRadiusY = (viewHeight / 2) * 0.5;
          const radiusAdjustmentX = (line.yPosition || 0) / 100 * (baseRadiusX * 0.2);
          const radiusAdjustmentY = (line.yPosition || 0) / 100 * (baseRadiusY * 0.2);
          const textPathRadiusX = Math.max(10, baseRadiusX + radiusAdjustmentX);
          const textPathRadiusY = Math.max(10, baseRadiusY + radiusAdjustmentY);

          const isBottom = line.textPosition === 'bottom';
          
          svgContent += `<defs>`;
          if (isBottom) {
            svgContent += `<path id="${pathId}" d="M ${centerX + textPathRadiusX} ${centerY} 
              a ${textPathRadiusX},${textPathRadiusY} 0 1,1 -${textPathRadiusX * 2},0" />`;
          } else {
            svgContent += `<path id="${pathId}" d="M ${centerX - textPathRadiusX} ${centerY} 
              a ${textPathRadiusX},${textPathRadiusY} 0 1,0 ${textPathRadiusX * 2},0" />`;
          }
          svgContent += `</defs>`;

          const letterSpacing = line.letterSpacing ? `${line.letterSpacing}px` : '0.5px';
          const baseStartOffset = 50;
          const arcPositionAdjustment = (line.xPosition || 0) / 100 * 25;
          const startOffset = baseStartOffset + arcPositionAdjustment;

          if (isBottom) {
            svgContent += `
            <g transform="rotate(180 ${centerX} ${centerY})">
              <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                    ${line.bold ? 'font-weight="bold"' : ''} 
                    ${line.italic ? 'font-style="italic"' : ''} 
                    fill="${design.inkColor}"
                    letter-spacing="${letterSpacing}" text-anchor="middle">
                <textPath href="#${pathId}" startOffset="${100 - startOffset}%">
                  ${line.text}
                </textPath>
              </text>
            </g>
            `;
          } else {
            svgContent += `
            <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}"
                  letter-spacing="${letterSpacing}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${startOffset}%">
                ${line.text}
              </textPath>
            </text>
            `;
          }
        } else {
          // Straight text for rectangles - centered with proper vertical spacing
          const nonEmptyLines = design.lines.filter(l => !l.curved && l.text.trim());
          const lineIndex = nonEmptyLines.findIndex(l => l === line);
          
          // Calculate vertical spacing for multiple lines - centered
          let textY = centerY;
          if (nonEmptyLines.length > 1) {
            const totalSpacing = (nonEmptyLines.length - 1) * scaledFontSize * 1.2;
            const startY = centerY - totalSpacing / 2;
            textY = startY + lineIndex * scaledFontSize * 1.2;
          }
          
          const textX = centerX + (line.xPosition || 0) / 100 * (viewWidth / 4);
          textY += (line.yPosition || 0) / 100 * (viewHeight / 4);

          const letterSpacing = line.letterSpacing ? `letter-spacing="${line.letterSpacing}px"` : '';

          let textAnchor;
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';
          else textAnchor = 'middle';

          svgContent += `
            <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
                  text-anchor="${textAnchor}" fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''}
                  ${line.italic ? 'font-style="italic"' : ''}
                  ${letterSpacing}>
              ${line.text}
            </text>
          `;
        }
      });
    }

    // Add custom elements (QR codes, barcodes, etc.) - centered
    if (design.elements && design.elements.length > 0) {
      design.elements.forEach((element) => {
        const elementX = centerX + (element.x / 100) * (viewWidth / 4) - element.width / 2;
        const elementY = centerY + (element.y / 100) * (viewHeight / 4) - element.height / 2;

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

  // Download preview as PNG
  const downloadAsPng = () => {
    if (!svgRef.current || !product) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions (scale up for better quality)
    canvas.width = 1000;
    canvas.height = 800;

    // Create an image from the SVG
    const img = new Image();
    // Create a blob from the SVG string, not from the SVGSVGElement
    const svgBlob = new Blob([svgRef.current], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw image to canvas (white background)
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Create download link
      const link = document.createElement('a');
      link.download = `${product.name}-stamp.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return {
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
