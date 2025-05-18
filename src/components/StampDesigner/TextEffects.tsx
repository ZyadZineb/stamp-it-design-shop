
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TextEffectsProps {
  onApplyEffect: (effect: {
    type: 'shadow' | 'outline' | 'bold' | 'italic' | 'none';
    color?: string;
    blur?: number;
    thickness?: number;
  }) => void;
  currentEffect: {
    type: 'shadow' | 'outline' | 'bold' | 'italic' | 'none';
    color?: string;
    blur?: number;
    thickness?: number;
  };
}

const TextEffects: React.FC<TextEffectsProps> = ({ onApplyEffect, currentEffect }) => {
  const { t } = useTranslation();
  const [effect, setEffect] = useState<'shadow' | 'outline' | 'bold' | 'italic' | 'none'>(currentEffect.type || 'none');
  const [color, setColor] = useState(currentEffect.color || '#000000');
  const [blur, setBlur] = useState(currentEffect.blur || 2);
  const [thickness, setThickness] = useState(currentEffect.thickness || 1);

  const handleEffectChange = (value: 'shadow' | 'outline' | 'bold' | 'italic' | 'none') => {
    setEffect(value);
    onApplyEffect({
      type: value,
      color,
      blur,
      thickness
    });
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (effect !== 'none') {
      onApplyEffect({
        type: effect,
        color: newColor,
        blur,
        thickness
      });
    }
  };

  const handleBlurChange = (newBlur: number[]) => {
    const blurValue = newBlur[0];
    setBlur(blurValue);
    if (effect === 'shadow') {
      onApplyEffect({
        type: effect,
        color,
        blur: blurValue,
        thickness
      });
    }
  };

  const handleThicknessChange = (newThickness: number[]) => {
    const thicknessValue = newThickness[0];
    setThickness(thicknessValue);
    if (effect === 'outline') {
      onApplyEffect({
        type: effect,
        color,
        blur,
        thickness: thicknessValue
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">{t('textEffects.title', 'Text Effects')}</h3>

      <div className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="effect-type">{t('textEffects.effectType', 'Effect Type')}</Label>
          <Select value={effect} onValueChange={(value: any) => handleEffectChange(value)}>
            <SelectTrigger id="effect-type">
              <SelectValue placeholder={t('textEffects.selectEffect', 'Select effect')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('textEffects.none', 'None')}</SelectItem>
              <SelectItem value="bold">{t('textEffects.bold', 'Bold')}</SelectItem>
              <SelectItem value="italic">{t('textEffects.italic', 'Italic')}</SelectItem>
              <SelectItem value="shadow">{t('textEffects.shadow', 'Shadow')}</SelectItem>
              <SelectItem value="outline">{t('textEffects.outline', 'Outline')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(effect === 'shadow' || effect === 'outline') && (
          <div className="grid gap-2">
            <Label htmlFor="effect-color">{t('textEffects.effectColor', 'Effect Color')}</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                id="effect-color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-500">{color}</span>
            </div>
          </div>
        )}

        {effect === 'shadow' && (
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="effect-blur">{t('textEffects.blur', 'Blur')}</Label>
              <span className="text-sm text-gray-500">{blur}px</span>
            </div>
            <Slider
              id="effect-blur"
              defaultValue={[blur]}
              max={10}
              min={0}
              step={0.5}
              onValueChange={handleBlurChange}
            />
          </div>
        )}

        {effect === 'outline' && (
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="effect-thickness">{t('textEffects.thickness', 'Thickness')}</Label>
              <span className="text-sm text-gray-500">{thickness}px</span>
            </div>
            <Slider
              id="effect-thickness"
              defaultValue={[thickness]}
              max={3}
              min={0.5}
              step={0.1}
              onValueChange={handleThicknessChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEffects;
