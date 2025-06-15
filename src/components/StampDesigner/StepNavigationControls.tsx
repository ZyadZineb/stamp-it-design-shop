
import React from 'react';
import { Button } from "@/components/ui/button";

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

interface StepNavigationControlsProps {
  currentStep: StepType;
  onPrev: () => void;
  onNext: () => void;
  largeControls?: boolean;
}

const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];

const StepNavigationControls: React.FC<StepNavigationControlsProps> = ({
  currentStep, onPrev, onNext, largeControls = false
}) => {
  const currentIndex = steps.indexOf(currentStep);
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 'templates'}
        className={`${largeControls ? "text-lg py-4 px-8" : "py-3 px-6"} rounded-xl border-2 transition-all duration-200 ${
          currentStep === 'templates' ? 'opacity-50' : 'hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        ← Précédent
      </Button>

      <div className="text-center">
        <div className="text-sm text-gray-500 mb-1">
          Étape {currentIndex + 1} sur {steps.length}
        </div>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentIndex + 1) / steps.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
      
      <Button
        variant="default"
        onClick={onNext}
        disabled={currentStep === 'preview'}
        className={`${largeControls ? "text-lg py-4 px-8" : "py-3 px-6"} rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
          currentStep === 'preview' ? 'opacity-50' : 'hover:scale-[1.02] shadow-lg'
        }`}
      >
        {currentStep === 'color' ? 'Aperçu' : 'Suivant'} →
      </Button>
    </div>
  );
};

export default StepNavigationControls;
