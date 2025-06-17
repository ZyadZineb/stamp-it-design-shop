
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AlignmentControlsProps {
  alignment: 'left' | 'center' | 'right';
  onAlignmentChange: (alignment: 'left' | 'center' | 'right') => void;
  disabled?: boolean;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  alignment,
  onAlignmentChange,
  disabled = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
      <Button
        variant={alignment === 'left' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onAlignmentChange('left')}
        disabled={disabled}
        className="h-11 w-11 p-0 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
        title={t('alignment.left', 'Align Left')}
        aria-label={t('alignment.left', 'Align Left')}
        aria-pressed={alignment === 'left'}
      >
        <AlignLeft size={18} />
      </Button>
      <Button
        variant={alignment === 'center' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onAlignmentChange('center')}
        disabled={disabled}
        className="h-11 w-11 p-0 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
        title={t('alignment.center', 'Center')}
        aria-label={t('alignment.center', 'Center')}
        aria-pressed={alignment === 'center'}
      >
        <AlignCenter size={18} />
      </Button>
      <Button
        variant={alignment === 'right' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onAlignmentChange('right')}
        disabled={disabled}
        className="h-11 w-11 p-0 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
        title={t('alignment.right', 'Align Right')}
        aria-label={t('alignment.right', 'Align Right')}
        aria-pressed={alignment === 'right'}
      >
        <AlignRight size={18} />
      </Button>
    </div>
  );
};

export default AlignmentControls;
