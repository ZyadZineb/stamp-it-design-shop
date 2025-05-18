
import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface HelpTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  showIcon?: boolean;
  iconSize?: number;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  content, 
  children, 
  showIcon = true,
  iconSize = 16
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">
            {children}
            {showIcon && (
              <InfoIcon 
                size={iconSize} 
                className="ml-1 text-gray-400 hover:text-gray-600 transition-colors" 
              />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="text-sm">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ContextualHelpProps {
  id: string;
  children: React.ReactNode;
}

// This component will show a help button that displays context-sensitive help
export const ContextualHelp: React.FC<ContextualHelpProps> = ({ id, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Show help"
      >
        <InfoIcon size={20} />
      </button>
      
      {isVisible && (
        <div className="absolute z-50 top-full right-0 mt-2 p-4 bg-white rounded-md shadow-lg border border-gray-200 w-64">
          <div className="text-sm">{children}</div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close help"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
