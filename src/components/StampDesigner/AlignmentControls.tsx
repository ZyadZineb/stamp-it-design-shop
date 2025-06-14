
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
    <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-md">
      <Button
        variant={alignment === 'left' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onAlignmentChange('left')}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title={t('alignment.left', 'Align Left')}
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        variant={alignment === 'center' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onAlignmentChange('center')}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title={t('alignment.center', 'Center')}
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        variant={alignment === 'right' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onAlignmentChange('right')}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title={t('alignment.right', 'Align Right')}
      >
        <AlignRight size={16} />
      </Button>
    </div>
  );
};

export default AlignmentControls;
