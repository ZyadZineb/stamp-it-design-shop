
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { HelpTooltip } from '@/components/ui/tooltip-custom';

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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
            {t('borderStyle.title', 'Border style')}
          </h3>
          <HelpTooltip content={t('borderStyle.help', 'Choose how your stamp border appears. Single and double borders provide classic looks, while wavy adds a decorative touch.')}>
            <span className="sr-only">{t('borderStyle.help', 'Border style help')}</span>
          </HelpTooltip>
        </div>
        
        <RadioGroup
          value={borderStyle}
          onValueChange={(value) => onBorderStyleChange(value as 'single' | 'double' | 'wavy' | 'none')}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          aria-label={t('borderStyle.selectLabel', 'Select border style')}
        >
          <div className="border-2 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer transition-colors min-h-[120px]">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 border-transparent rounded-full bg-gray-100"></div>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="none" 
                id="none" 
                className="h-5 w-5"
                aria-describedby="none-description"
              />
              <Label 
                htmlFor="none" 
                className={`cursor-pointer ${largeControls ? "text-base" : ""}`}
              >
                {t('borderStyle.none', 'No Border')}
              </Label>
            </div>
            <span id="none-description" className="sr-only">
              {t('borderStyle.noneDescription', 'Clean design without border')}
            </span>
          </div>
          
          <div className="border-2 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer transition-colors min-h-[120px]">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black"></div>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="single" 
                id="single" 
                className="h-5 w-5"
                aria-describedby="single-description"
              />
              <Label 
                htmlFor="single" 
                className={`cursor-pointer ${largeControls ? "text-base" : ""}`}
              >
                {t('borderStyle.single', 'Single')}
              </Label>
            </div>
            <span id="single-description" className="sr-only">
              {t('borderStyle.singleDescription', 'Classic single line border')}
            </span>
          </div>
          
          <div className="border-2 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer transition-colors min-h-[120px]">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-14 h-14 border-2 rounded-full border-black relative">
                <div className="absolute inset-1 border-2 border-black rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="double" 
                id="double" 
                className="h-5 w-5"
                aria-describedby="double-description"
              />
              <Label 
                htmlFor="double" 
                className={`cursor-pointer ${largeControls ? "text-base" : ""}`}
              >
                {t('borderStyle.double', 'Double')}
              </Label>
            </div>
            <span id="double-description" className="sr-only">
              {t('borderStyle.doubleDescription', 'Professional double line border')}
            </span>
          </div>
          
          <div className="border-2 rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 cursor-pointer transition-colors min-h-[120px]">
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
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="wavy" 
                id="wavy" 
                className="h-5 w-5"
                aria-describedby="wavy-description"
              />
              <Label 
                htmlFor="wavy" 
                className={`cursor-pointer ${largeControls ? "text-base" : ""}`}
              >
                {t('borderStyle.wavy', 'Wavy')}
              </Label>
            </div>
            <span id="wavy-description" className="sr-only">
              {t('borderStyle.wavyDescription', 'Decorative wavy border pattern')}
            </span>
          </div>
        </RadioGroup>

        {/* Border Thickness Control */}
        {borderStyle !== 'none' && onBorderThicknessChange && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                {t('borderStyle.thickness', 'Border Thickness')}
                <HelpTooltip content={t('borderStyle.thicknessHelp', 'Adjust how thick the border lines appear on your stamp')}>
                  <span className="sr-only">{t('borderStyle.thicknessHelp', 'Border thickness help')}</span>
                </HelpTooltip>
              </Label>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {borderThickness}px
              </span>
            </div>
            <div className="px-2">
              <Slider
                value={[borderThickness]}
                min={0.5}
                max={3}
                step={0.5}
                onValueChange={([value]) => onBorderThicknessChange(value)}
                className="w-full"
                aria-label={t('borderStyle.thicknessSlider', 'Border thickness slider')}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>0.5px</span>
              <span>3px</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderStyleSelector;
