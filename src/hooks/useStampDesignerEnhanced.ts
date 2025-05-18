import { useState, useEffect, useRef } from 'react';
import { StampDesign, StampTextLine, Product } from '../types';

interface DesignHistoryState {
  past: StampDesign[];
  present: StampDesign;
  future: StampDesign[];
}

// Main hook function
const useStampDesignerEnhanced = (product: Product | null) => {
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
    textEffect: {
      type: 'none'
    }
  };

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
    shape: product?.shape || 'rectangle',
    borderStyle: 'single',
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
  const svgRef = useRef<string | null>(null);

  // Update design when product changes
  useEffect(() => {
    if (product) {
      const updatedDesign = {
        ...design,
        lines: initializeLines(),
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: product?.shape || 'rectangle'
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
  const setBorderStyle = (style: 'single' | 'double' | 'none') => {
    const updatedDesign = { ...design, borderStyle: style };
    updateHistory(updatedDesign);
  };

  // Toggle curved text with history tracking
  const toggleCurvedText = (index: number) => {
    updateLine(index, { curved: !design.lines[index].curved });
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
      present: {...design, lines: newLines, logoDragging: false}
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
      present: {...design, lines: newLines, logoDragging: true}
    }));
  };

  // Stop dragging
  const stopDragging = () => {
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });
    
    const updatedDesign = {...design, lines: newLines, logoDragging: false};
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
        present: {...design, lines: newLines}
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
  const addElement = (element: { type: string, dataUrl: string, width: number, height: number }) => {
    // Calculate the center coordinates for proper positioning
    const viewWidth = product?.size.split('x')[0] ? parseInt(product.size.split('x')[0]) : 60;
    const viewHeight = product?.size.split('x')[1] ? parseInt(product.size.split('x')[1]) : 40;
    
    // Define centerX and centerY based on viewBox dimensions
    const centerX = viewWidth / 2;
    const centerY = viewHeight / 2;
    
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

  // Generate preview image
  const generatePreview = (): string => {
    if (!product) {
      return '';
    }

    // Parse dimensions from product.size (format: "60x40")
    const sizeDimensions = product.size.split('x').map(dim => parseInt(dim.trim(), 10));
    let width = 300;
    let height = 200;
    
    // Set aspect ratio based on product dimensions
    if (sizeDimensions.length === 2) {
      const [productWidth, productHeight] = sizeDimensions;
      // Calculate SVG dimensions to maintain aspect ratio but fit within a reasonable size
      if (design.shape === 'circle') {
        // For circular stamps, use the smaller dimension
        const size = Math.min(productWidth, productHeight);
        width = height = size * 5; // Scale for better visibility
      } else {
        // For rectangular stamps, maintain aspect ratio
        const aspectRatio = productWidth / productHeight;
        // Base width on 300px, height calculated to maintain aspect ratio
        width = 300;
        height = width / aspectRatio;
      }
    } else if (design.shape === 'circle') {
      // Default for circle if no dimensions are available
      width = height = 300;
    }

    // Set viewBox to match exact mm dimensions
    const viewWidth = sizeDimensions[0] || 60;
    const viewHeight = sizeDimensions[1] || 40;
    
    // Start building the SVG
    let svgContent = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="white"/>
    `;
    
    // Add appropriate shape
    if (design.shape === 'circle') {
      // For circular stamps
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      const radius = Math.min(viewWidth, viewHeight) / 2 - 1; // Slightly smaller for border
      
      // Add border(s)
      if (design.borderStyle === 'single') {
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 1.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      }
      
      // Add logo if included
      if (design.includeLogo) {
        const logoSize = radius / 3;
        // Use custom logo position if available
        const logoX = centerX + (design.logoX || 0) / 100 * (radius - logoSize);
        const logoY = centerY + (design.logoY || 0) / 100 * (radius - logoSize);
        
        svgContent += `
          <circle cx="${logoX}" cy="${logoY}" r="${logoSize}" fill="#f1f1f1" stroke="${design.inkColor}" stroke-width="0.2"/>
          ${design.logoImage ? 
            `<image href="${design.logoImage}" x="${logoX - logoSize}" y="${logoY - logoSize}" width="${logoSize * 2}" height="${logoSize * 2}" preserveAspectRatio="xMidYMid meet" />` : 
            `<rect x="${logoX - logoSize/2}" y="${logoY - logoSize/2}" width="${logoSize}" height="${logoSize}" fill="#ddd"/>`}
        `;
      }
      
      // Add text lines with text effects
      design.lines.forEach((line) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox
        const scaledFontSize = (line.fontSize / 20) * (radius / 10);
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * radius;
        const yOffset = (line.yPosition || 0) / 100 * radius;
        
        const textX = centerX + xOffset;
        const textY = centerY + yOffset;
        
        // Generate filters for text effects if needed
        const textEffectId = `effect-${Math.random().toString(36).substr(2, 9)}`; // Unique ID
        let textEffectFilter = '';
        let textStroke = '';
        
        if (line.textEffect && line.textEffect.type === 'shadow') {
          svgContent += `
            <filter id="${textEffectId}">
              <feDropShadow dx="0" dy="${line.textEffect.blur || 2}" stdDeviation="${line.textEffect.blur || 2}" 
                            flood-color="${line.textEffect.color || '#000000'}" flood-opacity="0.5" />
            </filter>
          `;
          textEffectFilter = `filter="url(#${textEffectId})"`;
        } else if (line.textEffect && line.textEffect.type === 'outline') {
          textStroke = `stroke="${line.textEffect.color || '#000000'}" stroke-width="${line.textEffect.thickness || 1}" paint-order="stroke fill"`;
        }
        
        if (line.curved) {
          // Calculate the path for curved text
          const pathId = `textPath${Math.random().toString(36).substr(2, 9)}`; // Unique ID
          const pathRadius = radius - (radius * 0.2); // Smaller radius for curved text
          
          svgContent += `
            <defs>
              <path id="${pathId}" d="M ${centerX - pathRadius}, ${centerY} a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0 a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0" />
            </defs>
            <text fill="${design.inkColor}" font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''} ${textEffectFilter} ${textStroke}>
              <textPath href="#${pathId}" startOffset="${50 + (line.xPosition || 0) / 2}%" text-anchor="middle">
                ${line.text}
              </textPath>
            </text>
          `;
        } else {
          // Regular text with position adjustments
          // Set text-anchor based on alignment
          let textAnchor;
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';
          else textAnchor = 'middle';
          
          svgContent += `
            <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
                  text-anchor="${textAnchor}" fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''} ${textEffectFilter} ${textStroke}>
              ${line.text}
            </text>
          `;
        }
      });
      
    } else {
      // For rectangular stamps
      const cornerRadius = viewWidth * 0.05; // 5% of width as corner radius
      
      // Add border(s)
      if (design.borderStyle === 'single') {
        svgContent += `<rect x="0.5" y="0.5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <rect x="0.5" y="0.5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <rect x="2" y="2" width="${viewWidth - 4}" height="${viewHeight - 4}" rx="${cornerRadius - 0.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      }
      
      // Add logo if included
      const logoWidth = viewWidth * 0.2;
      const logoHeight = viewHeight * 0.2;
      
      // Center coordinates
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      
      // Use custom position if available, otherwise use preset positions
      let logoX, logoY;
      
      if (design.logoX !== undefined && design.logoY !== undefined) {
        // Convert from -100,100 range to viewBox coordinates
        logoX = centerX + (design.logoX / 100) * (viewWidth/2 - logoWidth/2);
        logoY = centerY + (design.logoY / 100) * (viewHeight/2 - logoHeight/2);
      } else {
        // Fallback to preset positions
        logoX = centerX - logoWidth / 2;
        logoY = centerY - logoHeight / 2;
        
        switch (design.logoPosition) {
          case 'top':
            logoY = viewHeight * 0.1;
            break;
          case 'bottom':
            logoY = viewHeight - logoHeight - viewHeight * 0.1;
            break;
          case 'left':
            logoX = viewWidth * 0.1;
            logoY = centerY - logoHeight / 2;
            break;
          case 'right':
            logoX = viewWidth - logoWidth - viewWidth * 0.1;
            logoY = centerY - logoHeight / 2;
            break;
        }
      }
      
      svgContent += `
        ${design.logoImage ? 
          `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" />` : 
          `<rect x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" fill="#ddd"/>`}
      `;
      
      // Add text with text effects
      design.lines.forEach((line) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox
        const scaledFontSize = (line.fontSize / 20) * (viewHeight / 10);
        
        // Center coordinates
        const centerX = viewWidth / 2;
        const centerY = viewHeight / 2;
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * (viewWidth / 3);
        const yOffset = (line.yPosition || 0) / 100 * (viewHeight / 3);
        
        // Base position plus offset
        const textX = centerX + xOffset;
        const textY = centerY + yOffset;
        
        // Generate filters for text effects
        const textEffectId = `effect-${Math.random().toString(36).substr(2, 9)}`; // Unique ID
        let textEffectFilter = '';
        let textStroke = '';
        
        if (line.textEffect && line.textEffect.type === 'shadow') {
          svgContent += `
            <filter id="${textEffectId}">
              <feDropShadow dx="0" dy="${line.textEffect.blur || 2}" stdDeviation="${line.textEffect.blur || 2}" 
                            flood-color="${line.textEffect.color || '#000000'}" flood-opacity="0.5" />
            </filter>
          `;
          textEffectFilter = `filter="url(#${textEffectId})"`;
        } else if (line.textEffect && line.textEffect.type === 'outline') {
          textStroke = `stroke="${line.textEffect.color || '#000000'}" stroke-width="${line.textEffect.thickness || 1}" paint-order="stroke fill"`;
        }
        
        // Set text-anchor based on alignment
        let textAnchor;
        if (line.alignment === 'left') textAnchor = 'start';
        else if (line.alignment === 'right') textAnchor = 'end';
        else textAnchor = 'middle';
        
        svgContent += `
          <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
                text-anchor="${textAnchor}" fill="${design.inkColor}"
                ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''} 
                ${textEffectFilter} ${textStroke}>
            ${line.text}
          </text>
        `;
      });
    }
    
    // Add custom elements (QR codes, barcodes, etc.)
    if (design.elements && design.elements.length > 0) {
      // Calculate center coordinates for element positioning
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      
      design.elements.forEach((element) => {
        const elementX = centerX + (element.x / 100) * (viewWidth/2 - element.width/2);
        const elementY = centerY + (element.y / 100) * (viewHeight/2 - element.height/2);
        
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
    svgRef.current = svgContent; // Store the SVG content for download
    setPreviewImage(previewUrl);
    return previewUrl;
  };

  return {
    design,
    updateLine,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    setLogoImage,
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    generatePreview,
    downloadAsPng,
    previewImage,
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
    applyTextEffect
  };
};

export default useStampDesignerEnhanced;
