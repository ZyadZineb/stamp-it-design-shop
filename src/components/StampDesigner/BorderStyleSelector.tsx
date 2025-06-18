
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { useTranslation } from 'react-i18next';

interface BorderStyleSelectorProps {
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  onStyleChange: (style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double') => void;
  borderThickness: number;
  onThicknessChange: (thickness: number) => void;
  largeControls?: boolean;
}

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({
  borderStyle,
  onStyleChange,
  borderThickness,
  onThicknessChange,
  largeControls = false
}) => {
  const { t } = useTranslation();

  const borderStyles = [
    { 
      id: 'none', 
      label: t('borderStyle.none', 'No Border'),
      tooltip: 'Remove border completely',
      preview: 'No border'
    },
    { 
      id: 'solid', 
      label: t('borderStyle.solid', 'Solid'),
      tooltip: 'Clean, professional solid line border',
      preview: '────'
    },
    { 
      id: 'dashed', 
      label: t('borderStyle.dashed', 'Dashed'),
      tooltip: 'Dashed line border for modern look',
      preview: '╌╌╌╌'
    },
    { 
      id: 'dotted', 
      label: t('borderStyle.dotted', 'Dotted'),
      tooltip: 'Dotted border for decorative effect',
      preview: '····'
    },
    { 
      id: 'double', 
      label: t('borderStyle.double', 'Double'),
      tooltip: 'Double line border for formal appearance',
      preview: '════'
    }
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
        {t('borderStyle.title', 'Border Style')}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {borderStyles.map((style) => (
          <HelpTooltip key={style.id} content={style.tooltip}>
            <Button
              variant={borderStyle === style.id ? "default" : "outline"}
              onClick={() => onStyleChange(style.id)}
              className={`
                h-auto min-h-[44px] p-3 flex flex-col items-center gap-1 text-center
                hover:bg-blue-50 hover:border-blue-300 transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2
                ${largeControls ? "min-h-[52px] p-4" : ""}
                ${borderStyle === style.id ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
              `}
              aria-pressed={borderStyle === style.id}
              aria-label={`${style.label} - ${style.tooltip}`}
            >
              <span className={`font-mono text-xs ${largeControls ? "text-sm" : ""}`}>
                {style.preview}
              </span>
              <span className={`text-xs leading-tight ${largeControls ? "text-sm" : ""}`}>
                {style.label}
              </span>
            </Button>
          </HelpTooltip>
        ))}
      </div>
      
      {borderStyle !== 'none' && (
        <div className="space-y-2">
          <label className={`block text-sm font-medium text-gray-700 ${largeControls ? "text-base" : ""}`}>
            {t('borderStyle.thickness', 'Border Thickness')}: {borderThickness}px
          </label>
          <Slider
            value={[borderThickness]}
            onValueChange={(value) => onThicknessChange(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        {t('borderStyle.help', 'Select a border style to frame your stamp design')}
      </p>
    </div>
  );
};

export default BorderStyleSelector;
