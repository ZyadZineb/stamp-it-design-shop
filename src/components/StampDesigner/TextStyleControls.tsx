
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Type, MoveVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StampTextLine } from '@/types';

interface TextStyleControlsProps {
  line: StampTextLine;
  index: number;
  largeControls?: boolean;
  onToggleBold: (index: number) => void;
  onToggleItalic: (index: number) => void;
  onToggleCurved: (index: number) => void;
  onFlipCurved: (index: number) => void;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({
  line,
  index,
  largeControls = false,
  onToggleBold,
  onToggleItalic,
  onToggleCurved,
  onFlipCurved
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="text-xs text-gray-500 mb-2">
        {t('textEditor.textStyle', 'Text Style')}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={line.bold ? "default" : "outline"}
          size={largeControls ? "default" : "sm"}
          onClick={() => onToggleBold(index)}
          className="flex items-center gap-2"
        >
          <Bold size={largeControls ? 20 : 16} />
          {t('textEditor.bold', 'Gras')}
        </Button>
        <Button
          variant={line.italic ? "default" : "outline"}
          size={largeControls ? "default" : "sm"}
          onClick={() => onToggleItalic(index)}
          className="flex items-center gap-2"
        >
          <Italic size={largeControls ? 20 : 16} />
          {t('textEditor.italic', 'Italique')}
        </Button>
        <Button
          variant={line.curved ? "default" : "outline"}
          size={largeControls ? "default" : "sm"}
          onClick={() => onToggleCurved(index)}
          className="flex items-center gap-2"
          title={t('textEditor.curvedText', 'Curved Text')}
        >
          <Type size={largeControls ? 20 : 16} />
          {t('textEditor.curved', 'Courbé')}
        </Button>
        {line.curved && (
          <Button
            variant="outline"
            size={largeControls ? "default" : "sm"}
            onClick={() => onFlipCurved(index)}
            className="flex items-center gap-2"
            title={t('textEditor.flipText', 'Flip Text Position')}
          >
            <MoveVertical size={largeControls ? 20 : 16} />
            {line.textPosition === 'top'
              ? t('textEditor.moveToBottom', 'Top → Bottom')
              : t('textEditor.moveToTop', 'Bottom → Top')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TextStyleControls;
