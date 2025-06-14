import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  MoveVertical,
  MoveHorizontal,
  Plus,
  Minus,
  Trash,
  ChevronDown,
  ChevronUp,
  Type
} from 'lucide-react';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { StampTextLine } from "@/types";

// All available fonts in one list
const availableFonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Brush Script', value: 'Brush Script MT, cursive' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, fantasy' },
  { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Bookman', value: 'Bookman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Palatino', value: 'Palatino, serif' }
];

interface EnhancedTextEditorProps {
  lines: StampTextLine[];
  maxLines: number;
  shape: 'rectangle' | 'circle' | 'square';
  activeLineIndex: number | null;
  setActiveLineIndex: (index: number | null) => void;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  toggleCurvedText: (index: number) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  largeControls?: boolean;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({
  lines,
  maxLines,
  shape,
  activeLineIndex,
  setActiveLineIndex,
  updateLine,
  addLine,
  removeLine,
  toggleCurvedText,
  updateTextPosition,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [expandedLine, setExpandedLine] = useState<number | null>(null);
  
  const handleTextChange = (index: number, text: string) => {
    updateLine(index, { text });
  };

  const handleFontChange = (index: number, fontFamily: string) => {
    updateLine(index, { fontFamily });
  };

  const handleFontSizeChange = (index: number, fontSize: number) => {
    updateLine(index, { fontSize });
  };

  const handleToggleBold = (index: number) => {
    const currentValue = lines[index].bold;
    updateLine(index, { bold: !currentValue });
  };

  const handleToggleItalic = (index: number) => {
    const currentValue = lines[index].italic;
    updateLine(index, { italic: !currentValue });
  };

  const handleAlignmentChange = (index: number, alignment: 'left' | 'center' | 'right') => {
    updateLine(index, { alignment });
  };

  const toggleExpanded = (index: number) => {
    setExpandedLine(expandedLine === index ? null : index);
  };

  const handleFlipCurvedText = (index: number) => {
    const currentPosition = lines[index].textPosition;
    const newPosition = currentPosition === 'top' ? 'bottom' : 'top';
    updateLine(index, { textPosition: newPosition });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">
          {t('textEditor.title', 'Text Lines')}
        </h3>
        <HelpTooltip 
          content={t('textEditor.helpText', 'Add and edit text for your stamp. Click on a line to select it and adjust its properties.')}
        >
          <span>{t('textEditor.help', 'Help')}</span>
        </HelpTooltip>
      </div>
      
      <div className="space-y-4">
        {lines.map((line, index) => (
          <div 
            key={index} 
            className={`border rounded-md overflow-hidden ${
              activeLineIndex === index ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200'
            }`}
          >
            <div 
              className={`p-3 flex justify-between items-center cursor-pointer ${
                activeLineIndex === index ? 'bg-brand-blue/10' : 'bg-white'
              }`}
              onClick={() => setActiveLineIndex(index)}
            >
              <div className="flex-1">
                <span className="font-medium text-sm">
                  {t('textEditor.line', 'Line')} {index + 1}
                </span>
                <p className="truncate text-sm text-gray-600">
                  {line.text || t('textEditor.emptyLine', '(Empty line)')}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLine(index);
                  }}
                  disabled={lines.length <= 1}
                >
                  <Trash size={largeControls ? 20 : 16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(index);
                  }}
                >
                  {expandedLine === index ? (
                    <ChevronUp size={largeControls ? 20 : 16} />
                  ) : (
                    <ChevronDown size={largeControls ? 20 : 16} />
                  )}
                </Button>
              </div>
            </div>
            
            {(expandedLine === index || activeLineIndex === index) && (
              <div className="p-3 border-t border-gray-100 space-y-3">
                <Input
                  value={line.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  placeholder={t('textEditor.enterText', 'Enter text')}
                  className={largeControls ? "text-lg p-3" : ""}
                />
                
                {/* Bold, Italic, and Curved Text Controls - More Prominent */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500 mb-2">
                    {t('textEditor.textStyle', 'Text Style')}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={line.bold ? "default" : "outline"}
                      size={largeControls ? "default" : "sm"}
                      onClick={() => handleToggleBold(index)}
                      className="flex items-center gap-2"
                    >
                      <Bold size={largeControls ? 20 : 16} />
                      {t('textEditor.bold', 'Gras')}
                    </Button>
                    <Button
                      variant={line.italic ? "default" : "outline"}
                      size={largeControls ? "default" : "sm"}
                      onClick={() => handleToggleItalic(index)}
                      className="flex items-center gap-2"
                    >
                      <Italic size={largeControls ? 20 : 16} />
                      {t('textEditor.italic', 'Italique')}
                    </Button>
                    {/* Curved text now available for ALL shapes */}
                    <Button
                      variant={line.curved ? "default" : "outline"}
                      size={largeControls ? "default" : "sm"}
                      onClick={() => toggleCurvedText(index)}
                      className="flex items-center gap-2"
                      title={t('textEditor.curvedText', 'Curved Text')}
                    >
                      <Type size={largeControls ? 20 : 16} />
                      {t('textEditor.curved', 'Courbé')}
                    </Button>
                    {/* Flip button for curved text - available for ALL shapes */}
                    {line.curved && (
                      <Button
                        variant="outline"
                        size={largeControls ? "default" : "sm"}
                        onClick={() => handleFlipCurvedText(index)}
                        className="flex items-center gap-2"
                        title={t('textEditor.flipText', 'Flip Text Position')}
                      >
                        <MoveVertical size={largeControls ? 20 : 16} />
                        {line.textPosition === 'top' ? t('textEditor.moveToBottom', 'Top → Bottom') : t('textEditor.moveToTop', 'Bottom → Top')}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {t('textEditor.font', 'Font')}
                    </div>
                    <Select
                      value={line.fontFamily}
                      onValueChange={(value) => handleFontChange(index, value)}
                    >
                      <SelectTrigger className={largeControls ? "text-lg h-12" : ""}>
                        <SelectValue placeholder={t('textEditor.selectFont', 'Select font')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFonts.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      {t('textEditor.fontSize', 'Font Size')}
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFontSizeChange(index, Math.max(8, line.fontSize - 1))}
                      >
                        <Minus size={largeControls ? 20 : 16} />
                      </Button>
                      <div className="w-12 text-center">
                        {line.fontSize}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFontSizeChange(index, Math.min(72, line.fontSize + 1))}
                      >
                        <Plus size={largeControls ? 20 : 16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    {t('textEditor.alignment', 'Alignment')}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={line.alignment === 'left' ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleAlignmentChange(index, 'left')}
                    >
                      <AlignLeft size={largeControls ? 20 : 16} />
                    </Button>
                    <Button
                      variant={line.alignment === 'center' ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleAlignmentChange(index, 'center')}
                    >
                      <AlignCenter size={largeControls ? 20 : 16} />
                    </Button>
                    <Button
                      variant={line.alignment === 'right' ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleAlignmentChange(index, 'right')}
                    >
                      <AlignRight size={largeControls ? 20 : 16} />
                    </Button>
                  </div>
                </div>
                
                {/* Position Controls - Now available for both straight and curved text */}
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>
                      {line.curved 
                        ? t('textEditor.curvedHorizontalPosition', 'Arc Position') 
                        : t('textEditor.horizontalPosition', 'Horizontal Position')
                      }
                    </span>
                    <span className="font-mono">{line.xPosition || 0}</span>
                  </div>
                  <Slider
                    defaultValue={[line.xPosition || 0]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateTextPosition(index, value, line.yPosition || 0)}
                  />
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex justify-between">
                    <span>
                      {line.curved 
                        ? t('textEditor.curvedVerticalPosition', 'Radius Adjustment') 
                        : t('textEditor.verticalPosition', 'Vertical Position')
                      }
                    </span>
                    <span className="font-mono">{line.yPosition || 0}</span>
                  </div>
                  <Slider
                    defaultValue={[line.yPosition || 0]}
                    min={-100}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateTextPosition(index, line.xPosition || 0, value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {lines.length < maxLines && (
          <Button 
            variant="outline" 
            onClick={addLine} 
            className="w-full" 
            size={largeControls ? "lg" : "default"}
          >
            <Plus className="mr-2" size={largeControls ? 20 : 16} />
            {t('textEditor.addLine', 'Add Text Line')}
          </Button>
        )}
        
        {lines.length >= maxLines && (
          <p className="text-sm text-gray-500 text-center">
            {t('textEditor.maxLinesReached', 'Maximum number of lines reached')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnhancedTextEditor;
