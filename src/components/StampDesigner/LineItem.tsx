
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash, Plus, Minus, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import FontSelector from "./FontSelector";
import TextStyleControls from "./TextStyleControls";
import { Slider } from "@/components/ui/slider";
import { StampTextLine } from "@/types";
import { useTranslation } from "react-i18next";

interface LineItemProps {
  line: StampTextLine;
  index: number;
  expanded: boolean;
  active: boolean;
  linesLength: number;
  largeControls?: boolean;
  onSetActive: (index: number) => void;
  onRemove: (index: number) => void;
  onToggleExpand: (index: number) => void;
  onTextChange: (index: number, value: string) => void;
  onFontChange: (index: number, value: string) => void;
  onFontSizeChange: (index: number, size: number) => void;
  onToggleBold: (index: number) => void;
  onToggleItalic: (index: number) => void;
  onToggleCurved: (index: number) => void;
  onFlipCurved: (index: number) => void;
  onAlignmentChange: (index: number, alignment: 'left' | 'center' | 'right') => void;
  onUpdateTextPosition: (index: number, x: number, y: number) => void;
}

const LineItem: React.FC<LineItemProps> = ({
  line,
  index,
  expanded,
  active,
  linesLength,
  largeControls = false,
  onSetActive,
  onRemove,
  onToggleExpand,
  onTextChange,
  onFontChange,
  onFontSizeChange,
  onToggleBold,
  onToggleItalic,
  onToggleCurved,
  onFlipCurved,
  onAlignmentChange,
  onUpdateTextPosition
}) => {
  const { t } = useTranslation();

  return (
    <div 
      className={`border rounded-md overflow-hidden ${
        active ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-gray-200'
      }`}
    >
      <div 
        className={`p-3 flex justify-between items-center cursor-pointer ${active ? 'bg-brand-blue/10' : 'bg-white'}`}
        onClick={() => onSetActive(index)}
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
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            disabled={linesLength <= 1}
          >
            <Trash size={largeControls ? 20 : 16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(index); }}
          >
            {expanded ? (
              <ChevronUp size={largeControls ? 20 : 16} />
            ) : (
              <ChevronDown size={largeControls ? 20 : 16} />
            )}
          </Button>
        </div>
      </div>
      
      {(expanded || active) && (
        <div className="p-3 border-t border-gray-100 space-y-3">
          <Input
            value={line.text}
            onChange={(e) => onTextChange(index, e.target.value)}
            placeholder={t('textEditor.enterText', 'Enter text')}
            className={largeControls ? "text-lg p-3" : ""}
          />
          
          <TextStyleControls
            line={line}
            index={index}
            largeControls={largeControls}
            onToggleBold={onToggleBold}
            onToggleItalic={onToggleItalic}
            onToggleCurved={onToggleCurved}
            onFlipCurved={onFlipCurved}
          />

          <div className="grid grid-cols-2 gap-3">
            <FontSelector
              value={line.fontFamily}
              onChange={(font) => onFontChange(index, font)}
              largeControls={largeControls}
            />
            
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('textEditor.fontSize', 'Font Size')}
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onFontSizeChange(index, Math.max(8, line.fontSize - 1))}
                >
                  <Minus size={largeControls ? 20 : 16} />
                </Button>
                <div className="w-12 text-center">
                  {line.fontSize}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onFontSizeChange(index, Math.min(72, line.fontSize + 1))}
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
                onClick={() => onAlignmentChange(index, 'left')}
              >
                <AlignLeft size={largeControls ? 20 : 16} />
              </Button>
              <Button
                variant={line.alignment === 'center' ? "default" : "outline"}
                size="icon"
                onClick={() => onAlignmentChange(index, 'center')}
              >
                <AlignCenter size={largeControls ? 20 : 16} />
              </Button>
              <Button
                variant={line.alignment === 'right' ? "default" : "outline"}
                size="icon"
                onClick={() => onAlignmentChange(index, 'right')}
              >
                <AlignRight size={largeControls ? 20 : 16} />
              </Button>
            </div>
          </div>
          
          {/* Position Controls */}
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
              onValueChange={([value]) => onUpdateTextPosition(index, value, line.yPosition || 0)}
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
              onValueChange={([value]) => onUpdateTextPosition(index, line.xPosition || 0, value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineItem;
