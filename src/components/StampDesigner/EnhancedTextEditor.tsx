
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import LineItem from './LineItem';
import { Plus, AlertTriangle } from 'lucide-react';
import { StampTextLine } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  // Check for empty text validation
  const hasEmptyLines = lines.some(line => !line.text.trim());
  const allLinesEmpty = lines.every(line => !line.text.trim());
  
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="font-medium text-gray-800 text-lg">
          {t('textEditor.title', 'Text Lines')}
        </h3>
        <HelpTooltip 
          content={t('textEditor.helpText', 'Add and edit text for your stamp. Click on a line to select it and adjust its properties. Use the controls to format text, adjust spacing, and position elements.')}
          showIcon={true}
        >
          <span className="text-sm text-gray-600">{t('textEditor.help', 'Help')}</span>
        </HelpTooltip>
      </div>

      {/* Empty text warning */}
      {allLinesEmpty && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t('textEditor.emptyWarning', 'Add text to see your stamp preview. Your stamp needs at least one line of text.')}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 sm:space-y-4">
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
            hasEmptyText={!line.text.trim()}
          />
        ))}

        {lines.length < maxLines && (
          <Button 
            variant="outline" 
            onClick={addLine} 
            className={`w-full min-h-[44px] hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors ${largeControls ? "text-lg py-4" : ""}`}
            size={largeControls ? "lg" : "default"}
            aria-label={t('textEditor.addLineAriaLabel', 'Add new text line to stamp')}
          >
            <Plus className="mr-2" size={largeControls ? 20 : 16} />
            {t('textEditor.addLine', 'Add Text Line')}
          </Button>
        )}
        
        {lines.length >= maxLines && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {t('textEditor.maxLinesReached', 'Maximum number of lines reached')} ({maxLines})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTextEditor;
