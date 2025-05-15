
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

type WizardStep = 'shape' | 'text' | 'color' | 'logo' | 'preview';

interface WizardControlsProps {
  currentStep: WizardStep;
  steps: { id: WizardStep; label: string; description: string }[];
  onNext: () => void;
  onPrev: () => void;
  onJump: (step: WizardStep) => void;
}

const WizardControls: React.FC<WizardControlsProps> = ({
  currentStep,
  steps,
  onNext,
  onPrev,
  onJump
}) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{steps[currentStepIndex].label}</h3>
        <p className="text-sm text-gray-500">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{steps[currentStepIndex].description}</p>
      
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </Button>
        
        <div className="flex space-x-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => onJump(step.id)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentStepIndex
                  ? 'bg-brand-blue'
                  : index < currentStepIndex
                  ? 'bg-brand-blue/40'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant={isLastStep ? "default" : "outline"}
          onClick={onNext}
          className={`flex items-center ${isLastStep ? 'bg-brand-blue text-white' : ''}`}
        >
          {isLastStep ? 'Finish' : 'Next'}
          {!isLastStep && <ChevronRight size={16} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
};

export default WizardControls;
