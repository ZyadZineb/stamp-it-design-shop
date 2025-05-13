import React, { useEffect, useState, useRef } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Plus, 
  Minus, 
  ImageIcon,
  Trash2,
  Check,
  ShoppingCart,
  Circle,
  Square,
  RectangleHorizontal,
  TextQuote,
  MoveHorizontal,
  MoveVertical,
  Download
} from 'lucide-react';
import { useStampDesigner } from '../hooks/useStampDesigner';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
}

const StampDesigner: React.FC<StampDesignerProps> = ({ product, onAddToCart }) => {
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
    downloadAsPng
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Available fonts
  const availableFonts = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Palatino', label: 'Palatino' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Bookman', label: 'Bookman' },
    { value: 'Avant Garde', label: 'Avant Garde' },
  ];

  // Creating handleAddToCart function that was deleted but still referenced
  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the product to cart with the custom text and preview
    const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
    addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
    
    // Call the optional callback
    if (onAddToCart) onAddToCart();
  };

  // Handle logo upload (simulated)
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    // In a real app, this would connect to a file upload component
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  useEffect(() => {
    if (uploadedLogo) {
      // Update the stamp design with the uploaded logo
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Calculate relative position (-100 to 100 range)
    const relativeX = ((clickX / rect.width) * 2 - 1) * 100;
    const relativeY = ((clickY / rect.height) * 2 - 1) * 100;
    
    // If a line is active, update its position
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    }
    // If no line is active but logo is included, update logo position
    else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Mouse move handler for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    event.preventDefault();
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Touch move handler for mobile drag support
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

  // Start dragging (touch)
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if (!previewRef.current || event.touches.length === 0) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    
    const relativeX = ((touch.clientX - rect.left) / rect.width * 2 - 1) * 100;
    const relativeY = ((touch.clientY - rect.top) / rect.height * 2 - 1) * 100;
    
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    } else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
  };

  // Cleanup event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        stopDragging();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, stopDragging]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please select a product to start designing your stamp.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold">Custom Stamp Designer</h2>
        <p className="text-sm text-gray-600">Designing: {product.name} ({product.size})</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left panel: Design options */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Shape selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Shape & Border</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setBorderStyle('none')}
                className={`p-2 border rounded-md flex items-center gap-1 ${design.borderStyle === 'none' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
              >
                <span className="text-sm">No Border</span>
              </button>
              <button
                onClick={() => setBorderStyle('single')}
                className={`p-2 border rounded-md flex items-center gap-1 ${design.borderStyle === 'single' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
              >
                <span className="text-sm">Single Border</span>
              </button>
              <button
                onClick={() => setBorderStyle('double')}
                className={`p-2 border rounded-md flex items-center gap-1 ${design.borderStyle === 'double' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
              >
                <span className="text-sm">Double Border</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Text Lines</h3>
            <p className="text-xs text-gray-500">This stamp can have up to {product.lines} lines of text</p>
            
            {design.lines.map((line, index) => (
              <div 
                key={index} 
                className={`space-y-2 p-3 border rounded-md ${activeLineIndex === index ? 'border-brand-blue ring-2 ring-blue-100' : 'border-gray-200'}`}
                onClick={() => setActiveLineIndex(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Line {index + 1}</span>
                  {activeLineIndex === index && (
                    <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-1 rounded">Selected</span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLine(index);
                      if (activeLineIndex === index) setActiveLineIndex(null);
                    }}
                    className="ml-auto text-red-500 hover:text-red-700"
                    disabled={design.lines.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLine(index, { text: e.target.value })}
                  placeholder={`Line ${index + 1} text`}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
                <div className="flex flex-wrap gap-2">
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLine(index, { alignment: 'left' });
                      }}
                      className={`p-1 ${line.alignment === 'left' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                      title="Align Left"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLine(index, { alignment: 'center' });
                      }}
                      className={`p-1 ${line.alignment === 'center' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                      title="Align Center"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLine(index, { alignment: 'right' });
                      }}
                      className={`p-1 ${line.alignment === 'right' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                      title="Align Right"
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLine(index, { bold: !line.bold });
                    }}
                    className={`p-1 border rounded-md ${line.bold ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLine(index, { italic: !line.italic });
                    }}
                    className={`p-1 border rounded-md ${line.italic ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLine(index, { fontSize: Math.max(7, line.fontSize - 1) });
                      }}
                      className="p-1 bg-gray-100"
                      title="Decrease Font Size"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2 text-sm">{line.fontSize}pt</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLine(index, { fontSize: Math.min(40, line.fontSize + 1) });
                      }}
                      className="p-1 bg-gray-100"
                      title="Increase Font Size"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {design.shape === 'circle' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCurvedText(index);
                      }}
                      className={`p-1 border rounded-md flex items-center gap-1 ${line.curved ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                      title="Toggle Curved Text"
                    >
                      <TextQuote size={16} />
                      <span className="text-xs">Curved</span>
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <Label htmlFor={`font-family-${index}`} className="text-xs text-gray-500 block mb-1">
                    Font Family
                  </Label>
                  <Select
                    value={line.fontFamily}
                    onValueChange={(value) => updateLine(index, { fontFamily: value })}
                  >
                    <SelectTrigger id={`font-family-${index}`} className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFonts.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`x-position-${index}`} className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <MoveHorizontal size={14} /> Horizontal Position
                    </Label>
                    <Slider
                      id={`x-position-${index}`}
                      min={-100}
                      max={100}
                      step={1}
                      value={[line.xPosition || 0]}
                      onValueChange={(value) => updateTextPosition(index, value[0], line.yPosition || 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`y-position-${index}`} className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <MoveVertical size={14} /> Vertical Position
                    </Label>
                    <Slider
                      id={`y-position-${index}`}
                      min={-100}
                      max={100}
                      step={1}
                      value={[line.yPosition || 0]}
                      onValueChange={(value) => updateTextPosition(index, line.xPosition || 0, value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {design.lines.length < product.lines && (
              <button
                onClick={addLine}
                className="flex items-center gap-1 text-sm text-brand-blue hover:text-blue-700"
              >
                <Plus size={16} /> Add another line
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Ink Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.inkColors.map((color) => (
                <button 
                  key={color}
                  onClick={() => setInkColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${design.inkColor === color ? 'border-gray-900' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                >
                  {design.inkColor === color && (
                    <Check size={16} className="text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">Include Logo</h3>
              <label className="relative inline-flex items-center cursor-pointer ml-3">
                <input 
                  type="checkbox" 
                  checked={design.includeLogo} 
                  onChange={toggleLogo} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>
            
            {design.includeLogo && (
              <div className="space-y-2">
                <div 
                  className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleLogoUpload}
                >
                  <div className="flex justify-center mb-2">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {uploadedLogo ? "Logo uploaded! Click to change" : "Click to upload your logo"}
                  </p>
                  {uploadedLogo && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-md">
                      <img src={uploadedLogo} alt="Uploaded logo" className="h-16 mx-auto object-contain" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <MoveHorizontal size={14} /> Logo Horizontal Position
                    </Label>
                    <Slider
                      min={-100}
                      max={100}
                      step={1}
                      value={[design.logoX || 0]}
                      onValueChange={(value) => updateLogoPosition(value[0], design.logoY || 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <MoveVertical size={14} /> Logo Vertical Position
                    </Label>
                    <Slider
                      min={-100}
                      max={100}
                      step={1}
                      value={[design.logoY || 0]}
                      onValueChange={(value) => updateLogoPosition(design.logoX || 0, value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">You can also drag the logo directly on the preview area</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right panel: Preview and add to cart */}
        <div className="space-y-6">
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Live Preview</h3>
              <div className="flex gap-2">
                <p className="text-xs text-gray-600 self-center">
                  {product.size} mm
                </p>
                <Button 
                  onClick={downloadAsPng}
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  disabled={!previewImage}
                >
                  <Download size={16} />
                  Download PNG
                </Button>
              </div>
            </div>
            <div 
              className="flex justify-center items-center bg-white border rounded-md p-4 min-h-60 cursor-pointer relative touch-none"
              ref={previewRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Stamp Preview" 
                    className="max-w-full max-h-48 pointer-events-none"
                    draggable="false"
                  />
                  {(activeLineIndex !== null || design.includeLogo) && !isDragging && (
                    <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center pointer-events-none">
                      <p className="bg-white/90 text-xs px-3 py-1 rounded-lg shadow text-gray-600">
                        {activeLineIndex !== null ? 
                          `Drag to position Line ${activeLineIndex + 1}` : 
                          "Drag to position Logo"}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center">
                  Start designing to see a preview
                </p>
              )}
            </div>
            {isDragging ? (
              <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
                <p>Release to set position</p>
              </div>
            ) : activeLineIndex !== null ? (
              <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
                <p>Click and drag in the preview area to position Line {activeLineIndex + 1}</p>
              </div>
            ) : design.includeLogo ? (
              <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
                <p>Click and drag in the preview area to position your logo</p>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">Sample Designs</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
                  <img src="/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png" alt="Sample stamp" className="w-full h-auto" />
                </div>
                <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
                  <img src="/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png" alt="Sample stamp" className="w-full h-auto" />
                </div>
                <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
                  <img src="/lovable-uploads/ef68040b-498e-4d2f-a69f-f379ff643c4b.png" alt="Sample stamp" className="w-full h-auto" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Click on a sample to get inspiration</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{product.name}</h3>
                <span className="font-bold text-brand-red">{product.price} DHS TTC</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-brand-red text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDesigner;
