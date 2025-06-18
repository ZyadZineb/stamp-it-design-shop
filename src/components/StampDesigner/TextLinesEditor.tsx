import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Type, RotateCcw, Palette } from 'lucide-react';
import { StampTextLine, Product } from '@/types';
import { useTranslation } from 'react-i18next';
import AlignmentControls from './AlignmentControls';

interface TextLinesEditorProps {
  lines: StampTextLine[];
  onUpdateLine: (index: number, updates: Partial<StampTextLine>) => void;
  onAddLine: () => void;
  onRemoveLine: () => void;
  productShape: 'rectangle' | 'circle' | 'square' | 'ellipse';
  maxLines: number;
  onToggleCurvedText: (index: number, textPosition?: 'top' | 'bottom' | 'left' | 'right') => void;
  globalAlignment?: 'left' | 'center' | 'right';
  onGlobalAlignmentChange?: (alignment: 'left' | 'center' | 'right') => void;
}

const TextLinesEditor: React.FC<TextLinesEditorProps> = ({
  lines,
  onUpdateLine,
  onAddLine,
  onRemoveLine,
  productShape,
  maxLines,
  onToggleCurvedText,
  globalAlignment = 'center',
  onGlobalAlignmentChange
}) => {
  const { t } = useTranslation();

  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Calibri'
  ];

  return (
    <div className="space-y-6">
      {/* Global Alignment Controls */}
      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-orange-800">
            {t('textEditor.globalAlignment', 'Text Alignment')}
          </Label>
          <div className="text-xs text-orange-600">
            {t('textEditor.alignmentHint', 'Controls how all text is positioned')}
          </div>
        </div>
        {onGlobalAlignmentChange && (
          <AlignmentControls
            alignment={globalAlignment}
            onAlignmentChange={onGlobalAlignmentChange}
          />
        )}
      </div>

      {/* Text Lines */}
      <div className="space-y-4">
        {lines.map((line, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type size={16} className="text-orange-500" />
                {t('textEditor.line', 'Line')} {index + 1}
              </Label>
              <div className="flex gap-2">
                {lines.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveLine(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title={t('textEditor.removeLine', 'Remove line')}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-3">
              <div>
                <Label htmlFor={`text-${index}`} className="text-xs text-gray-600 mb-1 block">
                  {t('textEditor.textContent', 'Text Content')}
                  <span className="text-orange-500 ml-1">
                    {t('textEditor.clickToEdit', '(Click to edit)')}
                  </span>
                </Label>
                <Input
                  id={`text-${index}`}
                  value={line.text}
                  onChange={(e) => onUpdateLine(index, { text: e.target.value })}
                  placeholder={t('textEditor.enterText', 'Enter your text here...')}
                  className="min-h-[44px] text-base" // Mobile-friendly touch target
                />
              </div>

              {/* Font Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    {t('textEditor.fontFamily', 'Font Family')}
                  </Label>
                  <Select
                    value={line.fontFamily}
                    onValueChange={(value) => onUpdateLine(index, { fontFamily: value })}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    {t('textEditor.fontSize', 'Font Size')}
                    <span className="text-orange-500 ml-1">
                      {t('textEditor.dragToResize', '(Drag to resize)')}
                    </span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[line.fontSize]}
                      onValueChange={(value) => onUpdateLine(index, { fontSize: value[0] })}
                      min={8}
                      max={32}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {line.fontSize}px
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Style Controls */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`bold-${index}`}
                    checked={line.bold}
                    onCheckedChange={(checked) => onUpdateLine(index, { bold: checked })}
                  />
                  <Label htmlFor={`bold-${index}`} className="text-sm">
                    {t('textEditor.bold', 'Bold')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`italic-${index}`}
                    checked={line.italic}
                    onCheckedChange={(checked) => onUpdateLine(index, { italic: checked })}
                  />
                  <Label htmlFor={`italic-${index}`} className="text-sm">
                    {t('textEditor.italic', 'Italic')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`curved-${index}`}
                    checked={line.curved}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onToggleCurvedText(index, 'top');
                      } else {
                        onUpdateLine(index, { curved: false });
                      }
                    }}
                  />
                  <Label htmlFor={`curved-${index}`} className="text-sm">
                    {t('textEditor.curved', 'Curved')}
                  </Label>
                </div>
              </div>

              {/* Curved Text Position */}
              {line.curved && (
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    {t('textEditor.curvedPosition', 'Curved Position')}
                  </Label>
                  <Select
                    value={line.textPosition || 'top'}
                    onValueChange={(value: 'top' | 'bottom' | 'left' | 'right') => 
                      onUpdateLine(index, { textPosition: value })
                    }
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">{t('textEditor.top', 'Top')}</SelectItem>
                      <SelectItem value="bottom">{t('textEditor.bottom', 'Bottom')}</SelectItem>
                      <SelectItem value="left">{t('textEditor.left', 'Left')}</SelectItem>
                      <SelectItem value="right">{t('textEditor.right', 'Right')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Individual Line Alignment */}
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  {t('textEditor.lineAlignment', 'Line Alignment')}
                  <span className="text-orange-500 ml-1">
                    {t('textEditor.overridesGlobal', '(Overrides global)')}
                  </span>
                </Label>
                <AlignmentControls
                  alignment={line.alignment}
                  onAlignmentChange={(alignment) => onUpdateLine(index, { alignment })}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Line Button */}
        {productShape && lines.length < maxLines && (
          <Button
            onClick={onAddLine}
            variant="outline"
            className="w-full min-h-[44px] border-dashed border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
          >
            <Plus size={16} className="mr-2" />
            {t('textEditor.addLine', 'Add Text Line')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TextLinesEditor;
