
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface BorderStyleSelectorProps {
  borderStyle: 'single' | 'double' | 'wavy' | 'none';
  borderThickness?: number;
  onBorderStyleChange: (style: 'single' | 'double' | 'wavy' | 'none') => void;
  onBorderThicknessChange?: (thickness: number) => void;
  largeControls?: boolean;
}

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({ 
  borderStyle, 
  borderThickness = 1,
  onBorderStyleChange,
  onBorderThicknessChange,
  largeControls = false
}) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <h3 className={`font-medium text-gray-800 mb-3 ${largeControls ? "text-lg" : ""}`}>
          {t('borderStyle.title', 'Border Style')}
        </h3>
        
        <RadioGroup
          value={borderStyle}
          onValueChange={(value) => onBorderStyleChange(value as 'single' | 'double' | 'wavy' | 'none')}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
        >
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.none', 'No Border')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black"></div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.single', 'Single')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black relative">
                <div className="absolute inset-1 border-2 border-black rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="double" id="double" />
              <Label htmlFor="double" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.double', 'Double')}
              </Label>
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center gap-2 hover:bg-slate-50 cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center">
              <svg className="w-14 h-14" viewBox="0 0 56 56">
                <path
                  d="M 28 4 C 40 4, 52 16, 52 28 C 52 40, 40 52, 28 52 C 16 52, 4 40, 4 28 C 4 16, 16 4, 28 4"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="2,1"
                  className="animate-pulse"
                />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wavy" id="wavy" />
              <Label htmlFor="wavy" className={largeControls ? "text-base" : ""}>
                {t('borderStyle.wavy', 'Wavy')}
              </Label>
            </div>
          </div>
        </RadioGroup>

        {/* Border Thickness Control */}
        {borderStyle !== 'none' && onBorderThicknessChange && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2 flex justify-between">
              <span>{t('borderStyle.thickness', 'Border Thickness')}</span>
              <span className="font-mono">{borderThickness}</span>
            </div>
            <Slider
              value={[borderThickness]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={([value]) => onBorderThicknessChange(value)}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderStyleSelector;
