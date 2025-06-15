
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
  largeControls?: boolean;
}

const availableFonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Brush Script', value: 'Brush Script MT, cursive' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, fantasy' },
  { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Bookman', value: 'Bookman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Palatino', value: 'Palatino, serif' }
];

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, largeControls = false }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">
        {t('textEditor.font', 'Font')}
      </div>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className={largeControls ? "text-lg h-12" : ""}>
          <SelectValue placeholder={t('textEditor.selectFont', 'Select font')} />
        </SelectTrigger>
        <SelectContent>
          {availableFonts.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span style={{ fontFamily: font.value }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontSelector;
