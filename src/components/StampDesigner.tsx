
import React, { useEffect, useState } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Plus, 
  Minus, 
  Image as ImageIcon,
  Trash2,
  Check,
  ShoppingCart,
  Circle,
  Square,
  RectangleHorizontal,
  TextQuote
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
    generatePreview, 
    previewImage 
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Generate a preview before adding to cart
    const previewUrl = generatePreview();
    
    // Create a custom text string from all lines
    const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
    
    // Add the product to cart with the custom text and preview
    addToCart(product, 1, customText, design.inkColor, previewUrl);
    
    // Call the optional callback
    if (onAddToCart) onAddToCart();
  };

  const handlePreview = () => {
    setIsGeneratingPreview(true);
    setTimeout(() => {
      generatePreview();
      setIsGeneratingPreview(false);
    }, 500);
  };

  // Handle logo upload (simulated)
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    // In a real app, this would connect to a file upload component
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  useEffect(() => {
    // Auto-generate a preview when component mounts
    handlePreview();
  }, []);

  // Watch for logo changes to update the design
  useEffect(() => {
    if (uploadedLogo) {
      // Update the stamp design with the uploaded logo
      design.logoImage = uploadedLogo;
      handlePreview();
    }
  }, [uploadedLogo]);

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
        <div className="space-y-6">
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
              <div key={index} className="space-y-2 p-3 border border-gray-200 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Line {index + 1}</span>
                  <button 
                    onClick={() => removeLine(index)}
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
                      onClick={() => updateLine(index, { alignment: 'left' })}
                      className={`p-1 ${line.alignment === 'left' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      onClick={() => updateLine(index, { alignment: 'center' })}
                      className={`p-1 ${line.alignment === 'center' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      onClick={() => updateLine(index, { alignment: 'right' })}
                      className={`p-1 ${line.alignment === 'right' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => updateLine(index, { bold: !line.bold })}
                    className={`p-1 border rounded-md ${line.bold ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => updateLine(index, { italic: !line.italic })}
                    className={`p-1 border rounded-md ${line.italic ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                  >
                    <Italic size={16} />
                  </button>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => updateLine(index, { fontSize: Math.max(10, line.fontSize - 2) })}
                      className="p-1 bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2 text-sm">{line.fontSize}px</span>
                    <button
                      onClick={() => updateLine(index, { fontSize: Math.min(24, line.fontSize + 2) })}
                      className="p-1 bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {design.shape === 'circle' && (
                    <button
                      onClick={() => toggleCurvedText(index)}
                      className={`p-1 border rounded-md flex items-center gap-1 ${line.curved ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
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
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo Position</label>
                  <select
                    value={design.logoPosition}
                    onChange={(e) => setLogoPosition(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right panel: Preview and add to cart */}
        <div className="space-y-6">
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium text-gray-800 mb-3">Preview</h3>
            <div className="flex justify-center items-center bg-white border rounded-md p-4 min-h-60">
              {isGeneratingPreview ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                  <p className="text-sm text-gray-500">Generating preview...</p>
                </div>
              ) : previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Stamp Preview" 
                  className="max-w-full max-h-48"
                />
              ) : (
                <p className="text-gray-500 text-center">
                  Start designing to see a preview
                </p>
              )}
            </div>
            <button
              onClick={handlePreview}
              className="mt-3 w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Update Preview
            </button>
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
