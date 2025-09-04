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
          <div key={line.id || index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
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
                </Label>
                <Input
                  id={`text-${index}`}
                  value={line.text}
                  onChange={(e) => onUpdateLine(index, { text: e.target.value })}
                  placeholder={t('textEditor.enterText', 'Enter your text here...')}
                  className="w-full"
                />
              </div>

              {/* Font Family and Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`font-${index}`} className="text-xs text-gray-600 mb-1 block">
                    {t('textEditor.fontFamily', 'Font Family')}
                  </Label>
                  <Select value={line.fontFamily} onValueChange={(value) => onUpdateLine(index, { fontFamily: value })}>
                    <SelectTrigger id={`font-${index}`}>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`size-${index}`} className="text-xs text-gray-600 mb-1 block">
                    {t('textEditor.fontSize', 'Font Size')}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id={`size-${index}`}
                      min={8}
                      max={32}
                      step={1}
                      value={[line.fontSize]}
                      onValueChange={(value) => onUpdateLine(index, { fontSize: value[0], fontSizePt: value[0] })}
                      className="flex-1"
                    />
                    <span className="w-8 text-sm text-gray-600">{line.fontSize}</span>
                  </div>
                </div>
              </div>

              {/* Font Style */}
              <div className="flex items-center space-x-4">
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
              </div>

              {/* Alignment Controls */}
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">
                  {t('textEditor.alignment', 'Alignment')}
                </Label>
                <AlignmentControls
                  alignment={line.alignment}
                  onAlignmentChange={(alignment) => onUpdateLine(index, { alignment })}
                />
              </div>

              {/* Letter Spacing */}
              <div>
                <Label htmlFor={`spacing-${index}`} className="text-xs text-gray-600 mb-1 block">
                  {t('textEditor.letterSpacing', 'Letter Spacing')}
                </Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id={`spacing-${index}`}
                    min={-2}
                    max={8}
                    step={0.5}
                    value={[line.letterSpacing || 0]}
                    onValueChange={(value) => onUpdateLine(index, { letterSpacing: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-gray-600">{(line.letterSpacing || 0).toFixed(1)}</span>
                </div>
              </div>

              {/* Curved Text Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <Label className="text-sm font-medium">
                    {t('textEditor.curvedText', 'Curved Text')}
                  </Label>
                  <p className="text-xs text-gray-600">
                    {t('textEditor.curvedTextDesc', 'Follow a circular path')}
                  </p>
                </div>
                <Switch
                  checked={line.curved || line.curve?.enabled || false}
                  onCheckedChange={() => onToggleCurvedText(index)}
                />
              </div>

              {/* Position Controls */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Position Controls</Label>
                
                {!(line.curved || line.curve?.enabled) ? (
                  // Straight line positioning
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Bar id="xMm" label="Horizontal (X)" unit="mm" min={SAFE_MM} max={widthMm-SAFE_MM} step={0.5}
                      value={line.xMm || widthMm/2}
                      onChange={(v)=> onUpdateLine(index, { xMm: clamp(+v, SAFE_MM, widthMm-SAFE_MM) })}
                    />
                    <Bar id="yMm" label="Vertical (Y)" unit="mm" min={SAFE_MM} max={heightMm-SAFE_MM} step={0.5}
                      value={line.yMm || heightMm/2}
                      onChange={(v)=> onUpdateLine(index, { yMm: clamp(+v, SAFE_MM, heightMm-SAFE_MM) })}
                    />
                  </div>
                ) : (
                  // Curved line positioning
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Bar id="axisX" label="Axis X" unit="mm" min={SAFE_MM} max={widthMm-SAFE_MM} step={0.5}
                        value={line.axisXMm || widthMm/2}
                        onChange={(v)=> onUpdateLine(index, { axisXMm: clamp(+v, SAFE_MM, widthMm-SAFE_MM) })}
                      />
                      <Bar id="axisY" label="Axis Y" unit="mm" min={SAFE_MM} max={heightMm-SAFE_MM} step={0.5}
                        value={line.axisYMm || heightMm/2}
                        onChange={(v)=> onUpdateLine(index, { axisYMm: clamp(+v, SAFE_MM, heightMm-SAFE_MM) })}
                      />
                      <Bar id="rotation" label="Rotation" unit="°" min={-180} max={180} step={1}
                        value={line.rotationDeg || 0}
                        onChange={(v)=> onUpdateLine(index, { rotationDeg: Math.max(-180, Math.min(180, +v)) })}
                      />
                    </div>
                    
                    {/* Curved text controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Curve Settings</Label>
                        <Switch 
                          checked={line.curve?.enabled || false}
                          onCheckedChange={(enabled) => onUpdateLine(index, { 
                            curve: { 
                              enabled, 
                              radiusMm: enabled ? Math.min(widthMm, heightMm)/4 : undefined,
                              startAngleDeg: -90,
                              sweepDeg: 180,
                              direction: 'outer',
                              fitMode: 'none'
                            } 
                          })}
                        />
                      </div>
                      
                      {line.curve?.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <Bar 
                            id="radius" 
                            label="Radius" 
                            unit="mm" 
                            min={1} 
                            max={Math.min(widthMm, heightMm)/2 - SAFE_MM} 
                            step={0.5}
                            value={line.curve.radiusMm || Math.min(widthMm, heightMm)/4}
                            onChange={(v) => onUpdateLine(index, { 
                              curve: { ...line.curve!, radiusMm: +v } 
                            })}
                          />
                          <Bar 
                            id="startAngle" 
                            label="Start Angle" 
                            unit="°" 
                            min={-180} 
                            max={180} 
                            step={5}
                            value={line.curve.startAngleDeg || -90}
                            onChange={(v) => onUpdateLine(index, { 
                              curve: { ...line.curve!, startAngleDeg: +v } 
                            })}
                          />
                          <Bar 
                            id="sweep" 
                            label="Arc Span" 
                            unit="°" 
                            min={10} 
                            max={360} 
                            step={5}
                            value={line.curve.sweepDeg || 180}
                            onChange={(v) => onUpdateLine(index, { 
                              curve: { ...line.curve!, sweepDeg: +v } 
                            })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Line Button */}
      {lines.length < maxLines && (
        <Button
          onClick={onAddLine}
          variant="outline"
          className="w-full border-dashed border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
        >
          <Plus size={16} className="mr-2" />
          {t('textEditor.addLine', 'Add Text Line')}
        </Button>
      )}
    </div>
  );
};

export default TextLinesEditor;