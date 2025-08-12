import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Type } from 'lucide-react';
import { StampTextLine, Product } from '@/types';
import { useTranslation } from 'react-i18next';
import AlignmentControls from './AlignmentControls';
import Bar from '@/components/controls/Bar';
import { rangeForProductMm } from '@/utils/ranges';

interface TextLinesEditorProps {
  lines: StampTextLine[];
  onUpdateLine: (index: number, updates: Partial<StampTextLine>) => void;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  productShape: 'rectangle' | 'circle' | 'square' | 'ellipse';
  product?: Product | null;
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
  product,
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

  const { widthMm, heightMm } = rangeForProductMm({ size: product?.size || '38x14mm' });
  const SAFE_MM = 1.0;
  const clamp = (v:number,min:number,max:number)=> Math.min(max, Math.max(min, v));


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
                        // initialize curved defaults
                        onUpdateLine(index, {
                          radiusMm: line.radiusMm ?? 10,
                          arcDeg: line.arcDeg ?? 180,
                          curvedAlign: line.curvedAlign ?? 'center',
                          direction: line.direction ?? 'outside',
                          axisXMm: line.axisXMm,
                          axisYMm: line.axisYMm,
                          rotationDeg: line.rotationDeg ?? 0,
                        });
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

              {/* Position & Layout Controls */}
              {!line.curved ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Bar
                    id={`xMm-${index}`}
                    label={t('textEditor.horizontal', 'Horizontal (X)')}
                    unit="mm"
                    min={SAFE_MM}
                    max={widthMm - SAFE_MM}
                    step={0.5}
                    value={line.xMm ?? widthMm / 2}
                    onChange={(v)=> onUpdateLine(index, { xMm: clamp(+v, SAFE_MM, widthMm - SAFE_MM) })}
                  />
                  <Bar
                    id={`yMm-${index}`}
                    label={t('textEditor.vertical', 'Vertical (Y)')}
                    unit="mm"
                    min={SAFE_MM}
                    max={heightMm - SAFE_MM}
                    step={0.5}
                    value={line.yMm ?? heightMm / 2}
                    onChange={(v)=> onUpdateLine(index, { yMm: clamp(+v, SAFE_MM, heightMm - SAFE_MM) })}
                  />
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Baseline</Label>
                    <Select
                      value={line.baseline || 'alphabetic'}
                      onValueChange={(value: 'middle' | 'alphabetic' | 'hanging') => onUpdateLine(index, { baseline: value })}
                    >
                      <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="alphabetic">Alphabetic</SelectItem>
                        <SelectItem value="hanging">Hanging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Radius (mm)</Label>
                    <Input
                      type="number"
                      value={line.radiusMm ?? ''}
                      onChange={(e) => onUpdateLine(index, { radiusMm: Math.max(0, Number(e.target.value)) })}
                      placeholder="e.g. 12"
                      className="min-h-[44px]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Arc (°)</Label>
                    <Input
                      type="number"
                      value={line.arcDeg ?? 180}
                      onChange={(e) => onUpdateLine(index, { arcDeg: Number(e.target.value) })}
                      placeholder="180"
                      className="min-h-[44px]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Direction</Label>
                    <Select
                      value={line.direction || 'outside'}
                      onValueChange={(value: 'outside' | 'inside') => onUpdateLine(index, { direction: value })}
                    >
                      <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outside">Outside</SelectItem>
                        <SelectItem value="inside">Inside</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1 block">Align on Arc</Label>
                    <Select
                      value={line.curvedAlign || 'center'}
                      onValueChange={(value: 'center' | 'start' | 'end') => onUpdateLine(index, { curvedAlign: value })}
                    >
                      <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="start">Start</SelectItem>
                        <SelectItem value="end">End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Bar
                    id={`axisX-${index}`}
                    label={t('textEditor.axisX', 'Axis X')}
                    unit="mm"
                    min={SAFE_MM}
                    max={widthMm - SAFE_MM}
                    step={0.5}
                    value={line.axisXMm ?? widthMm / 2}
                    onChange={(v)=> onUpdateLine(index, { axisXMm: clamp(+v, SAFE_MM, widthMm - SAFE_MM) })}
                  />
                  <Bar
                    id={`axisY-${index}`}
                    label={t('textEditor.axisY', 'Axis Y')}
                    unit="mm"
                    min={SAFE_MM}
                    max={heightMm - SAFE_MM}
                    step={0.5}
                    value={line.axisYMm ?? heightMm / 2}
                    onChange={(v)=> onUpdateLine(index, { axisYMm: clamp(+v, SAFE_MM, heightMm - SAFE_MM) })}
                  />
                  <Bar
                    id={`rotation-${index}`}
                    label={t('textEditor.rotation', 'Rotation')}
                    unit="°"
                    min={-180}
                    max={180}
                    step={1}
                    value={line.rotationDeg ?? 0}
                    onChange={(v)=> onUpdateLine(index, { rotationDeg: Math.max(-180, Math.min(180, +v)) })}
                  />

                </div>
              )}

              {/* Letter Spacing (mm), Color, Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Letter Spacing (mm)</Label>
                  <Input
                    type="number"
                    value={line.letterSpacingMm ?? ''}
                    onChange={(e) => onUpdateLine(index, { letterSpacingMm: Number(e.target.value) })}
                    placeholder="e.g. 0.5"
                    className="min-h-[44px]"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Color</Label>
                  <Input
                    type="color"
                    value={(line.color as string) || '#000000'}
                    onChange={(e) => onUpdateLine(index, { color: e.target.value })}
                    className="h-[44px] w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id={`visible-${index}`}
                    checked={line.visible !== false}
                    onCheckedChange={(checked) => onUpdateLine(index, { visible: checked })}
                  />
                  <Label htmlFor={`visible-${index}`} className="text-sm">Visible</Label>
                </div>
              </div>

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
