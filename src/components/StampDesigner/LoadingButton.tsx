
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "relative transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2",
        className
      )}
    >
      {loading && (
        <Loader size={16} className="animate-spin mr-2" />
      )}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
