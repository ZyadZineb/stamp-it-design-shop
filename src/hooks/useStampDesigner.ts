import { useState, useEffect, useRef, useCallback } from 'react';
import { StampDesign, StampTextLine, Product } from '../types';
import { useUndoRedo } from './useUndoRedo';
import { useToast } from './use-toast';

export const STORAGE_KEY = 'stamp-designer-saved-designs';

export interface SavedDesign {
  id: string;
  name: string;
  date: string;
  design: StampDesign;
  productId?: string;
  previewImage?: string;
}

export interface DesignValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useStampDesigner = (product: Product | null) => {
  const { toast } = useToast();
  const defaultLine: StampTextLine = {
    text: '',
    fontSize: 16, // This represents points (pt) instead of pixels
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center',
    curved: false,
    xPosition: 0,
    yPosition: 0,
    isDragging: false
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
    borderStyle: 'single'
  };

  // Undo/Redo functionality
  const { state: design, saveState, undo, redo, canUndo, canRedo } = useUndoRedo<StampDesign>(initialDesign);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [validationResults, setValidationResults] = useState<DesignValidation>({
    isValid: true,
    errors: [],
    warnings: []
  });
  
  const svgRef = useRef<string | null>(null);

  // Load saved designs from localStorage
  useEffect(() => {
    const loadSavedDesigns = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setSavedDesigns(parsed);
        } catch (error) {
          console.error('Failed to parse saved designs', error);
        }
      }
    };
    
    loadSavedDesigns();
  }, []);

  useEffect(() => {
    // Update the design when product changes
    if (product) {
      const updatedDesign = {
        ...design,
        lines: initializeLines(),
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: product?.shape || 'rectangle'
      };
      saveState(updatedDesign);
    }
  }, [product]);

  // Auto-generate preview whenever design changes
  useEffect(() => {
    if (product) {
      generatePreview();
      validateDesign();
    }
  }, [design, product]);

  const validateDesign = useCallback(() => {
    if (!product) return;
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check if there's at least one line with text
    const hasText = design.lines.some(line => line.text.trim().length > 0);
    if (!hasText) {
      errors.push('Your stamp needs at least one line of text');
    }
    
    // Check for overlapping text elements
    // (This is a simplified validation, a real one would be more complex)
    const textLines = design.lines.filter(line => line.text.trim().length > 0);
    const positions = textLines.map(line => ({ y: line.yPosition || 0, fontSize: line.fontSize }));
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = Math.abs(positions[i].y - positions[j].y);
        const minDistance = (positions[i].fontSize + positions[j].fontSize) * 0.7;
        
        if (distance < minDistance) {
          warnings.push('Some text lines may be overlapping');
          break;
        }
      }
    }
    
    // Check if font sizes are appropriate
    const smallFonts = design.lines.some(line => line.text.trim().length > 0 && line.fontSize < 9);
    if (smallFonts) {
      warnings.push('Some text is very small and may not print clearly');
    }
    
    setValidationResults({
      isValid: errors.length === 0,
      errors,
      warnings
    });
    
    return errors.length === 0;
  }, [design, product]);

  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    
    // Add validation for fontSize if it's being updated
    if (updates.fontSize !== undefined) {
      // Ensure fontSize is between 7pt and 40pt
      updates.fontSize = Math.max(7, Math.min(40, updates.fontSize));
    }
    
    newLines[index] = { ...newLines[index], ...updates };
    saveState({ ...design, lines: newLines });
  };

  const addLine = () => {
    if (design.lines.length < (product?.lines || 5)) {
      saveState({
        ...design,
        lines: [...design.lines, { ...defaultLine }]
      });
    }
  };

  const removeLine = (index: number) => {
    const newLines = design.lines.filter((_, i) => i !== index);
    saveState({ ...design, lines: newLines });
  };

  const setInkColor = (color: string) => {
    saveState({ ...design, inkColor: color });
  };

  const toggleLogo = () => {
    saveState({ ...design, includeLogo: !design.includeLogo });
  };

  const setLogoPosition = (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    saveState({ ...design, logoPosition: position });
  };

  const setLogoImage = (imageUrl: string) => {
    saveState({ ...design, logoImage: imageUrl });
  };

  const setBorderStyle = (style: 'single' | 'double' | 'none') => {
    saveState({ ...design, borderStyle: style });
  };

  const toggleCurvedText = (index: number) => {
    updateLine(index, { curved: !design.lines[index].curved });
  };

  const updateTextPosition = (index: number, x: number, y: number) => {
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));
    
    updateLine(index, { 
      xPosition: constrainedX, 
      yPosition: constrainedY
    });
  };

  // New methods for drag functionality
  const startTextDrag = (index: number) => {
    const newLines = [...design.lines];
    newLines.forEach((line, i) => {
      line.isDragging = i === index;
    });
    saveState({...design, lines: newLines, logoDragging: false});
  };

  const startLogoDrag = () => {
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });
    saveState({...design, lines: newLines, logoDragging: true});
  };

  const stopDragging = () => {
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });
    saveState({...design, lines: newLines, logoDragging: false});
  };

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
    
    // Constrain movement within the stamp boundary
    const maxRange = design.shape === 'circle' ? 80 : 90; // Slightly smaller for circle
    const constrainedX = Math.max(-maxRange, Math.min(maxRange, relativeX));
    const constrainedY = Math.max(-maxRange, Math.min(maxRange, relativeY));
    
    // Update the position of the dragging element
    const draggingLineIndex = design.lines.findIndex(line => line.isDragging);
    
    if (draggingLineIndex !== -1) {
      // Update text position
      updateTextPosition(draggingLineIndex, constrainedX, constrainedY);
    } else if (design.logoDragging && design.includeLogo) {
      // Update logo position
      updateLogoPosition(constrainedX, constrainedY);
    }
  };

  const updateLogoPosition = (x: number, y: number) => {
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));
    
    saveState({
      ...design,
      logoX: constrainedX,
      logoY: constrainedY
    });
  };

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
      
      // Add text lines
      design.lines.forEach((line) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox - convert pt to appropriate size for SVG
        // In SVG, 1pt = 1.25px, and we need to scale based on viewBox dimensions
        const pointToUnitScale = 0.35; // Scale factor to convert pt to appropriate SVG units
        const scaledFontSize = line.fontSize * pointToUnitScale;
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * radius;
        const yOffset = (line.yPosition || 0) / 100 * radius;
        
        const textX = centerX + xOffset;
        const textY = centerY + yOffset;
        
        if (line.curved) {
          // Calculate the path for curved text
          const pathId = `textPath${Math.random().toString(36).substr(2, 9)}`; // Unique ID
          const pathRadius = radius - (radius * 0.2); // Smaller radius for curved text
          
          svgContent += `
            <defs>
              <path id="${pathId}" d="M ${centerX - pathRadius}, ${centerY} a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0 a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0" />
            </defs>
            <text fill="${design.inkColor}" font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
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
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
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
      if (design.includeLogo) {
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
      }
      
      // Add text
      design.lines.forEach((line) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox - convert pt to appropriate size for SVG
        const pointToUnitScale = 0.35; // Scale factor for pt to appropriate SVG units
        const scaledFontSize = line.fontSize * pointToUnitScale;
        
        // Center coordinates
        const centerX = viewWidth / 2;
        const centerY = viewHeight / 2;
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * (viewWidth / 3);
        const yOffset = (line.yPosition || 0) / 100 * (viewHeight / 3);
        
        // Base position plus offset
        const textX = centerX + xOffset;
        const textY = centerY + yOffset;
        
        // Set text-anchor based on alignment
        let textAnchor;
        if (line.alignment === 'left') textAnchor = 'start';
        else if (line.alignment === 'right') textAnchor = 'end';
        else textAnchor = 'middle';
        
        svgContent += `
          <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
                text-anchor="${textAnchor}" fill="${design.inkColor}"
                ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
            ${line.text}
          </text>
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

  const downloadAsPng = () => {
    if (!previewImage || !product) return;
    
    // Parse dimensions from product.size (format: "60x40") 
    const sizeDimensions = product.size.split('x').map(dim => parseInt(dim.trim(), 10));
    let pngWidth = 300;
    let pngHeight = 200;
    
    // Set exact dimensions for the download based on product size
    if (sizeDimensions.length === 2) {
      // Use actual mm dimensions multiplied by 8 for better quality
      // This makes 1mm = 8px in the output image
      pngWidth = sizeDimensions[0] * 8;
      pngHeight = sizeDimensions[1] * 8;
      
      if (design.shape === 'circle') {
        // For circular stamps, use the larger dimension
        pngWidth = pngHeight = Math.max(pngWidth, pngHeight);
      }
    }
    
    // Create a temporary image element to load the SVG
    const img = new Image();
    img.onload = function() {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to exact product dimensions in pixels
      canvas.width = pngWidth;
      canvas.height = pngHeight;
      
      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image scaled to fit the canvas properly
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to PNG data URL
      const pngData = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = pngData;
      downloadLink.download = `${product.name.replace(/\s+/g, '-')}-${product.size}-stamp.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = previewImage;
  };

  // New methods for the enhanced component
  const saveDesign = (name: string) => {
    if (!product) return;
    
    const newSavedDesign: SavedDesign = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      design: { ...design },
      productId: product.id,
      previewImage: previewImage || undefined
    };
    
    const updatedSavedDesigns = [...savedDesigns, newSavedDesign];
    setSavedDesigns(updatedSavedDesigns);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSavedDesigns));
    
    toast({
      title: "Design saved!",
      description: "Your design has been saved and can be loaded later."
    });
    
    return newSavedDesign.id;
  };
  
  const loadDesign = (designId: string) => {
    const savedDesign = savedDesigns.find(d => d.id === designId);
    if (savedDesign) {
      saveState(savedDesign.design);
      
      toast({
        title: "Design loaded",
        description: `Loaded design: ${savedDesign.name}`
      });
      
      return true;
    }
    return false;
  };
  
  const deleteSavedDesign = (designId: string) => {
    const updatedSavedDesigns = savedDesigns.filter(d => d.id !== designId);
    setSavedDesigns(updatedSavedDesigns);
    
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSavedDesigns));
    
    toast({
      title: "Design deleted",
      description: "The saved design has been removed."
    });
  };
  
  const applyTemplate = (templateDesign: StampDesign) => {
    if (!product) return;
    
    // Adjust the template to match the current product's capacity
    const adjustedLines = templateDesign.lines.slice(0, product.lines);
    while (adjustedLines.length < product.lines) {
      adjustedLines.push({ ...defaultLine });
    }
    
    const adjustedDesign = {
      ...templateDesign,
      lines: adjustedLines,
      // Ensure the color is supported by the product
      inkColor: product.inkColors.includes(templateDesign.inkColor)
        ? templateDesign.inkColor
        : product.inkColors[0],
      // Ensure the shape matches the product
      shape: product.shape || 'rectangle'
    };
    
    saveState(adjustedDesign);
    
    toast({
      title: "Template applied",
      description: "The template has been applied to your design."
    });
  };
  
  const setZoom = (level: number) => {
    setZoomLevel(Math.max(0.5, Math.min(3, level)));
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
    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
    // Saved designs
    savedDesigns,
    saveDesign,
    loadDesign,
    deleteSavedDesign,
    // Templates
    applyTemplate,
    // Validation
    validationResults,
    validateDesign,
    // Zoom
    zoomLevel,
    setZoom
  };
};
