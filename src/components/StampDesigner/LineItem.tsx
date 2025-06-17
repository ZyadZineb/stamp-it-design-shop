
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash, Plus, Minus, AlignLeft, AlignCenter, AlignRight, AlertCircle } from "lucide-react";
import FontSelector from "./FontSelector";
import TextStyleControls from "./TextStyleControls";
import { Slider } from "@/components/ui/slider";
import { StampTextLine } from "@/types";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { HelpTooltip } from '@/components/ui/tooltip-custom';

interface LineItemProps {
  line: StampTextLine;
  index: number;
  expanded: boolean;
  active: boolean;
  linesLength: number;
  largeControls?: boolean;
  hasEmptyText?: boolean;
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
  hasEmptyText = false,
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
      className={`border-2 rounded-lg overflow-hidden transition-all duration-200 ${
        active ? 'border-brand-blue ring-2 ring-brand-blue/20 shadow-md' : 
        hasEmptyText ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
      }`}
    >
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-50 ${
          active ? 'bg-brand-blue/10' : 'bg-white'
        }`}
        onClick={() => onSetActive(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSetActive(index);
          }
        }}
        aria-label={t('textEditor.lineAriaLabel', 'Line {{line}}', { line: index + 1 }) + (hasEmptyText ? ' - ' + t('textEditor.emptyText', 'Empty') : '')}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {t('textEditor.line', 'Line')} {index + 1}
            </span>
            {hasEmptyText && (
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            )}
          </div>
          <p className="truncate text-sm text-gray-600 mt-1">
            {line.text || (
              <span className="italic text-amber-600">
                {t('textEditor.emptyLine', 'Text required')}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            disabled={linesLength <= 1}
            className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
            aria-label={t('textEditor.removeLineAriaLabel', 'Remove this text line')}
          >
            <Trash size={largeControls ? 20 : 16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(index); }}
            className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            aria-label={expanded ? t('textEditor.collapseAriaLabel', 'Collapse controls') : t('textEditor.expandAriaLabel', 'Expand controls')}
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
        <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50/50">
          <div>
            <Label htmlFor={`text-input-${index}`} className="text-sm font-medium mb-2 block">
              {t('textEditor.textLabel', 'Text Content')}
              {hasEmptyText && <span className="text-amber-600 ml-1">*</span>}
            </Label>
            <Input
              id={`text-input-${index}`}
              value={line.text}
              onChange={(e) => onTextChange(index, e.target.value)}
              placeholder={t('textEditor.enterText', 'Enter text')}
              className={`${largeControls ? "text-lg p-3 min-h-[44px]" : "min-h-[44px]"} ${
                hasEmptyText ? 'border-amber-300 focus:ring-amber-500' : ''
              }`}
              aria-describedby={hasEmptyText ? `text-error-${index}` : undefined}
            />
            {hasEmptyText && (
              <p id={`text-error-${index}`} className="text-sm text-amber-600 mt-1">
                {t('textEditor.textRequired', 'This line needs text to appear on your stamp')}
              </p>
            )}
          </div>
          
          <TextStyleControls
            line={line}
            index={index}
            largeControls={largeControls}
            onToggleBold={onToggleBold}
            onToggleItalic={onToggleItalic}
            onToggleCurved={onToggleCurved}
            onFlipCurved={onFlipCurved}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t('textEditor.fontFamily', 'Font')}
              </Label>
              <FontSelector
                value={line.fontFamily}
                onChange={(font) => onFontChange(index, font)}
                largeControls={largeControls}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block flex items-center gap-1">
                {t('textEditor.fontSize', 'Font Size')}
                <HelpTooltip content={t('textEditor.fontSizeHelp', 'Adjust text size. Larger values make text more prominent.')}>
                  <span className="sr-only">{t('textEditor.fontSizeHelp', 'Font size help')}</span>
                </HelpTooltip>
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onFontSizeChange(index, Math.max(8, line.fontSize - 1))}
                  className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  aria-label={t('textEditor.decreaseFontSize', 'Decrease font size')}
                >
                  <Minus size={largeControls ? 20 : 16} />
                </Button>
                <div className="w-12 text-center font-mono text-sm bg-white border rounded px-2 py-1">
                  {line.fontSize}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onFontSizeChange(index, Math.min(72, line.fontSize + 1))}
                  className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  aria-label={t('textEditor.increaseFontSize', 'Increase font size')}
                >
                  <Plus size={largeControls ? 20 : 16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-1">
              {t('textEditor.alignment', 'Text Alignment')}
              <HelpTooltip content={t('textEditor.alignmentHelp', 'Choose how text is positioned horizontally within your stamp.')}>
                <span className="sr-only">{t('textEditor.alignmentHelp', 'Text alignment help')}</span>
              </HelpTooltip>
            </Label>
            <div className="flex gap-2">
              <Button
                variant={line.alignment === 'left' ? "default" : "outline"}
                size="icon"
                onClick={() => onAlignmentChange(index, 'left')}
                className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                aria-label={t('textEditor.alignLeft', 'Align left')}
                aria-pressed={line.alignment === 'left'}
              >
                <AlignLeft size={largeControls ? 20 : 18} />
              </Button>
              <Button
                variant={line.alignment === 'center' ? "default" : "outline"}
                size="icon"
                onClick={() => onAlignmentChange(index, 'center')}
                className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                aria-label={t('textEditor.alignCenter', 'Align center')}
                aria-pressed={line.alignment === 'center'}
              >
                <AlignCenter size={largeControls ? 20 : 18} />
              </Button>
              <Button
                variant={line.alignment === 'right' ? "default" : "outline"}
                size="icon"
                onClick={() => onAlignmentChange(index, 'right')}
                className="h-11 w-11 min-h-[44px] min-w-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                aria-label={t('textEditor.alignRight', 'Align right')}
                aria-pressed={line.alignment === 'right'}
              >
                <AlignRight size={largeControls ? 20 : 18} />
              </Button>
            </div>
          </div>
          
          {/* Position Controls */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {line.curved 
                    ? t('textEditor.curvedHorizontalPosition', 'Arc Position') 
                    : t('textEditor.horizontalPosition', 'Horizontal Position')
                  }
                  <HelpTooltip content={line.curved ? t('textEditor.arcPositionHelp', 'Adjust where text curves along the circle') : t('textEditor.horizontalPositionHelp', 'Move text left or right within the stamp')}>
                    <span className="sr-only">{line.curved ? t('textEditor.arcPositionHelp', 'Arc position help') : t('textEditor.horizontalPositionHelp', 'Horizontal position help')}</span>
                  </HelpTooltip>
                </span>
                <span className="font-mono text-xs bg-white border rounded px-2 py-1">{line.xPosition || 0}</span>
              </Label>
              <div className="px-2">
                <Slider
                  defaultValue={[line.xPosition || 0]}
                  min={-100}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onUpdateTextPosition(index, value, line.yPosition || 0)}
                  className="w-full"
                  aria-label={t('textEditor.horizontalPositionSlider', 'Horizontal position slider')}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
                <span>{t('textEditor.left', 'Left')}</span>
                <span>{t('textEditor.right', 'Right')}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {line.curved 
                    ? t('textEditor.curvedVerticalPosition', 'Radius Adjustment') 
                    : t('textEditor.verticalPosition', 'Vertical Position')
                  }
                  <HelpTooltip content={line.curved ? t('textEditor.radiusHelp', 'Adjust how far from center the curved text appears') : t('textEditor.verticalPositionHelp', 'Move text up or down within the stamp')}>
                    <span className="sr-only">{line.curved ? t('textEditor.radiusHelp', 'Radius adjustment help') : t('textEditor.verticalPositionHelp', 'Vertical position help')}</span>
                  </HelpTooltip>
                </span>
                <span className="font-mono text-xs bg-white border rounded px-2 py-1">{line.yPosition || 0}</span>
              </Label>
              <div className="px-2">
                <Slider
                  defaultValue={[line.yPosition || 0]}
                  min={-100}
                  max={100}
                  step={1}
                  onValueChange={([value]) => onUpdateTextPosition(index, line.xPosition || 0, value)}
                  className="w-full"
                  aria-label={t('textEditor.verticalPositionSlider', 'Vertical position slider')}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
                <span>{line.curved ? t('textEditor.closer', 'Closer') : t('textEditor.up', 'Up')}</span>
                <span>{line.curved ? t('textEditor.farther', 'Farther') : t('textEditor.down', 'Down')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineItem;
