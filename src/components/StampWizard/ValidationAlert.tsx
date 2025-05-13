
import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { DesignValidation } from '@/hooks/useStampDesigner';

interface ValidationAlertProps {
  validation: DesignValidation;
  onDismiss?: () => void;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ validation, onDismiss }) => {
  if (validation.isValid && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-2">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-0.5" size={18} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Please fix the following issues:</h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button onClick={onDismiss} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-500 mr-2 mt-0.5" size={18} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Suggestions:</h3>
              <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button onClick={onDismiss} className="text-yellow-500 hover:text-yellow-700">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
