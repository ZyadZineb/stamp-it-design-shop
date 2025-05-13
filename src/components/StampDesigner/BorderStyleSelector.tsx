
import React from 'react';

interface BorderStyleSelectorProps {
  borderStyle: 'none' | 'single' | 'double';
  onBorderStyleChange: (style: 'none' | 'single' | 'double') => void;
}

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({
  borderStyle,
  onBorderStyleChange
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">Shape & Border</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onBorderStyleChange('none')}
          className={`p-2 border rounded-md flex items-center gap-1 ${borderStyle === 'none' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
        >
          <span className="text-sm">No Border</span>
        </button>
        <button
          onClick={() => onBorderStyleChange('single')}
          className={`p-2 border rounded-md flex items-center gap-1 ${borderStyle === 'single' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
        >
          <span className="text-sm">Single Border</span>
        </button>
        <button
          onClick={() => onBorderStyleChange('double')}
          className={`p-2 border rounded-md flex items-center gap-1 ${borderStyle === 'double' ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}
        >
          <span className="text-sm">Double Border</span>
        </button>
      </div>
    </div>
  );
};

export default BorderStyleSelector;
