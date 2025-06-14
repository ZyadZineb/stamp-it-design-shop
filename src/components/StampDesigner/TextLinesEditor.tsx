
import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Plus, 
  Minus, 
  Trash2,
  TextQuote,
  MoveHorizontal,
  MoveVertical 
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StampTextLine } from '@/types';

// Available fonts that can be used for the text
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

interface TextLinesEditorProps {
  lines: StampTextLine[];
  maxLines: number;
  shape: 'rectangle' | 'circle' | 'square' | 'ellipse';
  activeLineIndex: number | null;
  setActiveLineIndex: (index: number | null) => void;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  toggleCurvedText: (index: number) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
}

const TextLinesEditor: React.FC<TextLinesEditorProps> = ({
  lines,
  maxLines,
  shape,
  activeLineIndex,
  setActiveLineIndex,
  updateLine,
  addLine,
  removeLine,
  toggleCurvedText,
  updateTextPosition
}) => {
  // Check if curved text is supported for this shape
  const supportsCurvedText = shape === 'circle' || shape === 'ellipse';

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">Text Lines</h3>
      <p className="text-xs text-gray-500">This stamp can have up to {maxLines} lines of text</p>
      {supportsCurvedText && (
        <p className="text-xs text-blue-600">✨ Curved text is available for {shape === 'circle' ? 'circular' : 'oval'} stamps</p>
      )}
      
      {lines.map((line, index) => (
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
            {line.curved && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Curved</span>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeLine(index);
                if (activeLineIndex === index) setActiveLineIndex(null);
              }}
              className="ml-auto text-red-500 hover:text-red-700"
              disabled={lines.length <= 1}
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
                  updateLine(index, { fontSize: Math.max(10, line.fontSize - 2) });
                }}
                className="p-1 bg-gray-100"
                title="Decrease Font Size"
              >
                <Minus size={16} />
              </button>
              <span className="px-2 text-sm">{line.fontSize}px</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { fontSize: Math.min(24, line.fontSize + 2) });
                }}
                className="p-1 bg-gray-100"
                title="Increase Font Size"
              >
                <Plus size={16} />
              </button>
            </div>
            {supportsCurvedText && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCurvedText(index);
                }}
                className={`p-1 border rounded-md flex items-center gap-1 ${line.curved ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                title={`Toggle Curved Text for ${shape === 'circle' ? 'Circle' : 'Oval'}`}
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
          {!line.curved && (
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
          )}
          {line.curved && (
            <div className="mt-3">
              <Label className="text-xs text-gray-500 mb-1 block">
                Curved Text Position
              </Label>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLine(index, { textPosition: 'top' });
                  }}
                  className={`px-2 py-1 text-xs border rounded ${line.textPosition === 'top' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                >
                  Top Arc
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLine(index, { textPosition: 'bottom' });
                  }}
                  className={`px-2 py-1 text-xs border rounded ${line.textPosition === 'bottom' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
                >
                  Bottom Arc
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {lines.length < maxLines && (
        <button
          onClick={addLine}
          className="flex items-center gap-1 text-sm text-brand-blue hover:text-blue-700"
        >
          <Plus size={16} /> Add another line
        </button>
      )}
    </div>
  );
};

export default TextLinesEditor;
