
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import LineItem from './LineItem';
import { Plus } from 'lucide-react';
import { StampTextLine } from "@/types";

interface EnhancedTextEditorProps {
  lines: StampTextLine[];
  maxLines: number;
  shape: 'rectangle' | 'circle' | 'square';
  activeLineIndex: number | null;
  setActiveLineIndex: (index: number | null) => void;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  toggleCurvedText: (index: number) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  largeControls?: boolean;
}

const EnhancedTextEditor: React.FC<EnhancedTextEditorProps> = ({
  lines,
  maxLines,
  shape,
  activeLineIndex,
  setActiveLineIndex,
  updateLine,
  addLine,
  removeLine,
  toggleCurvedText,
  updateTextPosition,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [expandedLine, setExpandedLine] = useState<number | null>(null);
  
  // Handler methods
  const handleTextChange = (index: number, text: string) => updateLine(index, { text });
  const handleFontChange = (index: number, fontFamily: string) => updateLine(index, { fontFamily });
  const handleFontSizeChange = (index: number, fontSize: number) => updateLine(index, { fontSize });
  const handleToggleBold = (index: number) => updateLine(index, { bold: !lines[index].bold });
  const handleToggleItalic = (index: number) => updateLine(index, { italic: !lines[index].italic });
  const handleAlignmentChange = (index: number, alignment: 'left' | 'center' | 'right') => updateLine(index, { alignment });
  const handleToggleCurvedText = (index: number) => toggleCurvedText(index);
  const handleFlipCurvedText = (index: number) => {
    const currentPosition = lines[index].textPosition;
    const newPosition = currentPosition === 'top' ? 'bottom' : 'top';
    updateLine(index, { textPosition: newPosition });
  };
  const handleUpdateTextPosition = (index: number, x: number, y: number) => updateTextPosition(index, x, y);

  const toggleExpanded = (index: number) => setExpandedLine(expandedLine === index ? null : index);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">
          {t('textEditor.title', 'Text Lines')}
        </h3>
        <HelpTooltip 
          content={t('textEditor.helpText', 'Add and edit text for your stamp. Click on a line to select it and adjust its properties.')}
        >
          <span>{t('textEditor.help', 'Help')}</span>
        </HelpTooltip>
      </div>
      <div className="space-y-4">
        {lines.map((line, index) => (
          <LineItem
            key={index}
            line={line}
            index={index}
            expanded={expandedLine === index}
            active={activeLineIndex === index}
            linesLength={lines.length}
            largeControls={largeControls}
            onSetActive={setActiveLineIndex}
            onRemove={removeLine}
            onToggleExpand={toggleExpanded}
            onTextChange={handleTextChange}
            onFontChange={handleFontChange}
            onFontSizeChange={handleFontSizeChange}
            onToggleBold={handleToggleBold}
            onToggleItalic={handleToggleItalic}
            onToggleCurved={handleToggleCurvedText}
            onFlipCurved={handleFlipCurvedText}
            onAlignmentChange={handleAlignmentChange}
            onUpdateTextPosition={handleUpdateTextPosition}
          />
        ))}

        {lines.length < maxLines && (
          <Button 
            variant="outline" 
            onClick={addLine} 
            className="w-full" 
            size={largeControls ? "lg" : "default"}
          >
            <Plus className="mr-2" size={largeControls ? 20 : 16} />
            {t('textEditor.addLine', 'Add Text Line')}
          </Button>
        )}
        
        {lines.length >= maxLines && (
          <p className="text-sm text-gray-500 text-center">
            {t('textEditor.maxLinesReached', 'Maximum number of lines reached')}
          </p>
        )}
      </div>
    </div>
  );
};

export default EnhancedTextEditor;
