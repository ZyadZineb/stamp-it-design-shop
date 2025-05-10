
import { useState, useEffect } from 'react';
import { StampDesign, StampTextLine, Product } from '../types';

export const useStampDesigner = (product: Product | null) => {
  const defaultLine: StampTextLine = {
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center'
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
    logoPosition: 'top'
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setDesign(prev => ({
      ...prev,
      lines: initializeLines(),
      inkColor: product?.inkColors[0] || prev.inkColor
    }));
  }, [product]);

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

  const generatePreview = (): string => {
    // This would normally use a canvas to generate a real preview
    // For now, we'll just return a placeholder string representing what the stamp would look like
    const preview = design.lines.map(line => line.text).join('\n');
    const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <rect x="10" y="10" width="280" height="180" stroke="#ccc" stroke-width="2" fill="none"/>
        ${design.includeLogo && design.logoPosition === 'top' ? 
          '<rect x="125" y="20" width="50" height="30" fill="#ddd"/>' : ''}
        <text x="150" y="100" font-family="Arial" font-size="14" text-anchor="middle" fill="${design.inkColor}">
          ${design.lines.map((line, index) => 
            `<tspan x="150" dy="${index === 0 ? 0 : 20}" 
              font-weight="${line.bold ? 'bold' : 'normal'}" 
              font-style="${line.italic ? 'italic' : 'normal'}"
              text-anchor="${line.alignment === 'left' ? 'start' : line.alignment === 'right' ? 'end' : 'middle'}"
            >${line.text || ' '}</tspan>`
          ).join('')}
        </text>
        ${design.includeLogo && design.logoPosition === 'bottom' ? 
          '<rect x="125" y="150" width="50" height="30" fill="#ddd"/>' : ''}
      </svg>
    `)}`;
    
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
    generatePreview,
    previewImage
  };
};
