
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
  Download,
  Undo,
  Redo,
  Save,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { WizardSteps } from './WizardStep';
import { ValidationAlert } from './ValidationAlert';
import { SavedDesigns } from './SavedDesigns';
import { TemplateGallery } from './TemplateGallery';

interface EnhancedStampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
  onProductSelect?: (productId: string) => void;
  products?: Product[];
}

const EnhancedStampDesigner: React.FC<EnhancedStampDesignerProps> = ({ 
  product, 
  onAddToCart,
  onProductSelect,
  products = []
}) => {
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
    downloadAsPng,
    // New features
    undo,
    redo,
    canUndo,
    canRedo,
    savedDesigns,
    saveDesign,
    loadDesign,
    deleteSavedDesign,
    applyTemplate,
    validationResults,
    validateDesign,
    zoomLevel,
    setZoom
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const isMobile = useIsMobile();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsValid, setStepsValid] = useState([true, false, false, false]);

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

  // Creating handleAddToCart function 
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

  // Validation for each step
  useEffect(() => {
    // Step 1: Product Selected
    const step1Valid = !!product;
    
    // Step 2: Text Added (at least one line with text)
    const step2Valid = design.lines.some(line => line.text.trim().length > 0);
    
    // Step 3: Style & Color (just validation check)
    const step3Valid = validateDesign();
    
    // Step 4: Review (all previous steps valid)
    const step4Valid = step1Valid && step2Valid && step3Valid;
    
    setStepsValid([step1Valid, step2Valid, step3Valid, step4Valid]);
  }, [design, product, validateDesign]);

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

  // Handlers for wizard navigation
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      
      {/* Wizard Steps */}
      <WizardSteps 
        currentStep={currentStep} 
        onStepChange={setCurrentStep}
        allStepsValid={stepsValid}
      />
      
      {/* Validation Alerts */}
      {!validationResults.isValid && (
        <div className="px-6">
          <ValidationAlert validation={validationResults} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left panel: Design options */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1: Product Selection */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-between">
                <h3 className="font-medium text-gray-800">Select Product</h3>
                <TemplateGallery onApplyTemplate={applyTemplate} />
              </div>
              
              {products.length > 0 && onProductSelect && (
                <div className="space-y-2">
                  <Label htmlFor="product-select">Select a Stamp Model</Label>
                  <Select
                    value={product.id}
                    onValueChange={onProductSelect}
                  >
                    <SelectTrigger id="product-select">
                      <SelectValue placeholder="Select a stamp model" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - {p.size} - {p.price} DHS
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Product Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Brand:</span>
                    <span className="ml-2">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Model:</span>
                    <span className="ml-2">{product.model}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-2">{product.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Lines:</span>
                    <span className="ml-2">{product.lines}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Shape:</span>
                    <span className="ml-2 capitalize">{product.shape}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">{product.price} DHS</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <div></div>
                <Button onClick={goToNextStep}>
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Text Lines */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Text Lines</h3>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo}
                    className="h-8 w-8 p-0"
                    title="Undo"
                  >
                    <Undo size={16} />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo}
                    className="h-8 w-8 p-0"
                    title="Redo"
                  >
                    <Redo size={16} />
                  </Button>
                </div>
              </div>
              
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
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  Previous Step
                </Button>
                <Button onClick={goToNextStep} disabled={!stepsValid[1]}>
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Style & Color */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Style & Color</h3>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo}
                    className="h-8 w-8 p-0"
                    title="Undo"
                  >
                    <Undo size={16} />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo}
                    className="h-8 w-8 p-0"
                    title="Redo"
                  >
                    <Redo size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Shape and Border */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Shape & Border</h4>
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
              
              {/* Active Line Formatting */}
              {activeLineIndex !== null && (
                <div className="space-y-3 p-4 border border-dashed border-brand-blue/40 rounded-md bg-brand-blue/5">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <span>Formatting Line {activeLineIndex + 1}</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="font-family" className="text-sm">Font Family</Label>
                      <Select
                        value={design.lines[activeLineIndex].fontFamily}
                        onValueChange={(value) => updateLine(activeLineIndex, { fontFamily: value })}
                      >
                        <SelectTrigger id="font-family">
                          <SelectValue placeholder="Select font" />
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
                    
                    <div>
                      <Label className="text-sm">Font Size ({design.lines[activeLineIndex].fontSize}pt)</Label>
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          onClick={() => updateLine(activeLineIndex, { 
                            fontSize: Math.max(7, design.lines[activeLineIndex].fontSize - 1) 
                          })}
                          className="p-1 bg-gray-100 flex-none w-8 flex justify-center"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="flex-1 text-center py-1">
                          {design.lines[activeLineIndex].fontSize}pt
                        </div>
                        <button
                          onClick={() => updateLine(activeLineIndex, { 
                            fontSize: Math.min(40, design.lines[activeLineIndex].fontSize + 1) 
                          })}
                          className="p-1 bg-gray-100 flex-none w-8 flex justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateLine(activeLineIndex, { bold: !design.lines[activeLineIndex].bold })}
                      className={`p-2 border rounded-md flex items-center gap-1 ${design.lines[activeLineIndex].bold ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    >
                      <Bold size={16} />
                      <span className="text-sm">Bold</span>
                    </button>
                    <button
                      onClick={() => updateLine(activeLineIndex, { italic: !design.lines[activeLineIndex].italic })}
                      className={`p-2 border rounded-md flex items-center gap-1 ${design.lines[activeLineIndex].italic ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    >
                      <Italic size={16} />
                      <span className="text-sm">Italic</span>
                    </button>
                    {design.shape === 'circle' && (
                      <button
                        onClick={() => toggleCurvedText(activeLineIndex)}
                        className={`p-2 border rounded-md flex items-center gap-1 ${design.lines[activeLineIndex].curved ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                      >
                        <TextQuote size={16} />
                        <span className="text-sm">Curved Text</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <MoveHorizontal size={14} /> Horizontal Position
                      </Label>
                      <Slider
                        min={-100}
                        max={100}
                        step={1}
                        value={[design.lines[activeLineIndex].xPosition || 0]}
                        onValueChange={(value) => updateTextPosition(activeLineIndex, value[0], design.lines[activeLineIndex].yPosition || 0)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <MoveVertical size={14} /> Vertical Position
                      </Label>
                      <Slider
                        min={-100}
                        max={100}
                        step={1}
                        value={[design.lines[activeLineIndex].yPosition || 0]}
                        onValueChange={(value) => updateTextPosition(activeLineIndex, design.lines[activeLineIndex].xPosition || 0, value[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ink Color */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Ink Color</h4>
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
              
              {/* Logo */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <h4 className="font-medium text-gray-800">Include Logo</h4>
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
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  Previous Step
                </Button>
                <Button onClick={goToNextStep} disabled={!stepsValid[2]}>
                  Next Step
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review & Order */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Review & Order</h3>
              
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <h4 className="font-medium">Order Summary</h4>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Product:</span>
                    <span className="ml-2">{product.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-2">{product.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Shape:</span>
                    <span className="ml-2 capitalize">{product.shape}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ink Color:</span>
                    <span className="ml-2 capitalize">{design.inkColor}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Text Lines:</span>
                    <span className="ml-2">{design.lines.filter(line => line.text.trim().length > 0).length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium">{product.price} DHS</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h5 className="text-sm font-medium mb-1">Text Preview:</h5>
                  <div className="border rounded p-2 bg-white text-sm">
                    {design.lines.map((line, i) => (
                      line.text.trim() && (
                        <div key={i} className="mb-1 last:mb-0">
                          <span className="text-gray-500 mr-1">Line {i+1}:</span>
                          <span>{line.text}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <SavedDesigns 
                  savedDesigns={savedDesigns}
                  onLoad={loadDesign}
                  onSave={saveDesign}
                  onDelete={deleteSavedDesign}
                />
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={downloadAsPng}
                >
                  <Download size={16} />
                  Download Preview
                </Button>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={goToPrevStep}>
                  Previous Step
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  className="bg-brand-red hover:bg-red-700 flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart ({product.price} DHS)
                </Button>
              </div>
            </div>
          )}
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
                
                <div className="flex gap-1 border rounded overflow-hidden">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoomLevel - 0.25))}
                    className="h-8 w-8 p-0 rounded-none"
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <div className="flex items-center justify-center min-w-10 text-xs">
                    {Math.round(zoomLevel * 100)}%
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setZoom(Math.min(3, zoomLevel + 0.25))}
                    className="h-8 w-8 p-0 rounded-none"
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn size={16} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative overflow-auto">
              <div 
                className="flex justify-center items-center bg-white border rounded-md p-4 min-h-60 cursor-pointer touch-none"
                ref={previewRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease'
                }}
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
          
          {/* Wizard Navigation for Mobile */}
          {isMobile && (
            <div className="flex justify-between gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={goToPrevStep} 
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              <Button 
                onClick={goToNextStep} 
                disabled={currentStep === 3 || !stepsValid[currentStep]}
                className="flex-1"
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
          
          {/* Design Templates */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStampDesigner;
