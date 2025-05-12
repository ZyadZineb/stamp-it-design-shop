
import { useState, useEffect } from 'react';
import { StampDesign, StampTextLine, Product } from '../types';

export const useStampDesigner = (product: Product | null) => {
  const defaultLine: StampTextLine = {
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center',
    curved: false,
    xPosition: 0,
    yPosition: 0
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

  const [design, setDesign] = useState<StampDesign>({
    lines: initializeLines(),
    inkColor: product?.inkColors[0] || 'blue',
    includeLogo: false,
    logoPosition: 'top',
    shape: product?.shape || 'rectangle',
    borderStyle: 'single'
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setDesign(prev => ({
      ...prev,
      lines: initializeLines(),
      inkColor: product?.inkColors[0] || prev.inkColor,
      shape: product?.shape || 'rectangle'
    }));
  }, [product]);

  // Auto-generate preview whenever design changes
  useEffect(() => {
    if (product) {
      generatePreview();
    }
  }, [design, product]);

  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    newLines[index] = { ...newLines[index], ...updates };
    setDesign({ ...design, lines: newLines });
  };

  const addLine = () => {
    if (design.lines.length < (product?.lines || 5)) {
      setDesign({
        ...design,
        lines: [...design.lines, { ...defaultLine }]
      });
    }
  };

  const removeLine = (index: number) => {
    const newLines = design.lines.filter((_, i) => i !== index);
    setDesign({ ...design, lines: newLines });
  };

  const setInkColor = (color: string) => {
    setDesign({ ...design, inkColor: color });
  };

  const toggleLogo = () => {
    setDesign({ ...design, includeLogo: !design.includeLogo });
  };

  const setLogoPosition = (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    setDesign({ ...design, logoPosition: position });
  };

  const setLogoImage = (imageUrl: string) => {
    setDesign({ ...design, logoImage: imageUrl });
  };

  const setBorderStyle = (style: 'single' | 'double' | 'none') => {
    setDesign({ ...design, borderStyle: style });
  };

  const toggleCurvedText = (index: number) => {
    updateLine(index, { curved: !design.lines[index].curved });
  };

  const updateTextPosition = (index: number, x: number, y: number) => {
    updateLine(index, { 
      xPosition: Math.max(-100, Math.min(100, x)), 
      yPosition: Math.max(-100, Math.min(100, y))
    });
  };

  const generatePreview = (): string => {
    // Determine dimensions based on shape
    const width = design.shape === 'circle' ? 300 : 300;
    const height = design.shape === 'circle' ? 300 : 200;
    
    // Start building the SVG
    let svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
    `;
    
    // Add appropriate shape
    if (design.shape === 'circle') {
      // For circular stamps
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 10;
      
      // Add border(s)
      if (design.borderStyle === 'single') {
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 10}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>
        `;
      }
      
      // Add logo if included
      if (design.includeLogo && design.logoPosition === 'center') {
        const logoSize = radius / 2;
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${logoSize}" fill="#f1f1f1" stroke="${design.inkColor}" stroke-width="1"/>
          ${design.logoImage ? 
            `<image href="${design.logoImage}" x="${centerX - logoSize}" y="${centerY - logoSize}" width="${logoSize * 2}" height="${logoSize * 2}" />` : 
            `<rect x="${centerX - logoSize/2}" y="${centerY - logoSize/2}" width="${logoSize}" height="${logoSize}" fill="#ddd"/>`}
        `;
      }
      
      // Add text lines
      design.lines.forEach((line, i) => {
        const lineCount = design.lines.length;
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * radius / 2;
        const yOffset = (line.yPosition || 0) / 100 * radius / 2;
        
        const textY = centerY + (i - (lineCount - 1) / 2) * 25 + yOffset;
        const textX = centerX + xOffset;
        
        if (line.curved) {
          // Calculate the path for curved text
          const pathId = `textPath${i}`;
          const pathRadius = radius - 20 - i * 5 + yOffset;
          
          svgContent += `
            <defs>
              <path id="${pathId}" d="M ${textX - pathRadius}, ${textY} a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0 a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0" />
            </defs>
            <text fill="${design.inkColor}" font-family="${line.fontFamily}" font-size="${line.fontSize}px"
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
              <textPath href="#${pathId}" startOffset="${50 + (line.xPosition || 0) / 2}%" text-anchor="middle">
                ${line.text || ' '}
              </textPath>
            </text>
          `;
        } else {
          // Regular text with position adjustments
          svgContent += `
            <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${line.fontSize}px" 
                  text-anchor="middle" fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
              ${line.text || ' '}
            </text>
          `;
        }
      });
      
    } else {
      // For rectangular stamps
      const cornerRadius = 5;
      
      // Add border(s)
      if (design.borderStyle === 'single') {
        svgContent += `<rect x="10" y="10" width="${width-20}" height="${height-20}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <rect x="10" y="10" width="${width-20}" height="${height-20}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>
          <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="2" fill="none"/>
        `;
      }
      
      // Add logo if included
      if (design.includeLogo) {
        const logoWidth = 50;
        const logoHeight = 30;
        
        let logoX = width / 2 - logoWidth / 2;
        let logoY = height / 2 - logoHeight / 2;
        
        // Adjust position based on logoPosition
        switch (design.logoPosition) {
          case 'top':
            logoY = 20;
            break;
          case 'bottom':
            logoY = height - logoHeight - 20;
            break;
          case 'left':
            logoX = 20;
            logoY = height / 2 - logoHeight / 2;
            break;
          case 'right':
            logoX = width - logoWidth - 20;
            logoY = height / 2 - logoHeight / 2;
            break;
        }
        
        svgContent += `
          ${design.logoImage ? 
            `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" />` : 
            `<rect x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" fill="#ddd"/>`}
        `;
      }
      
      // Calculate text position based on logo
      const centerX = width / 2;
      const centerY = height / 2;
      const textStartY = design.includeLogo && design.logoPosition === 'top' ? 70 : 50;
      
      // Add text
      design.lines.forEach((line, index) => {
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * (width / 4);
        const yOffset = (line.yPosition || 0) / 100 * 15;
        
        const textY = textStartY + index * 20 + yOffset;
        const textX = centerX + xOffset;
        
        let textAnchor;
        if (line.alignment === 'left') textAnchor = 'start';
        else if (line.alignment === 'right') textAnchor = 'end';
        else textAnchor = 'middle';
        
        svgContent += `
          <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${line.fontSize}px" 
                text-anchor="${textAnchor}" fill="${design.inkColor}"
                ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''}>
            ${line.text || ' '}
          </text>
        `;
      });
    }
    
    // Close the SVG
    svgContent += `</svg>`;
    
    const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
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
    generatePreview,
    previewImage
  };
};
