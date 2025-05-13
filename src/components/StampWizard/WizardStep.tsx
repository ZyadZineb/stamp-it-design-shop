
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepProps {
  index: number;
  title: string;
  status: 'upcoming' | 'current' | 'complete';
  onClick: () => void;
}

export const WizardStep: React.FC<StepProps> = ({ index, title, status, onClick }) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 cursor-pointer transition-colors", 
        status === 'current' && "text-brand-blue font-medium",
        status === 'complete' && "text-green-600",
        status === 'upcoming' && "text-gray-500"
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm border border-current transition-colors",
          status === 'current' && "bg-brand-blue/10 text-brand-blue",
          status === 'complete' && "bg-green-600 text-white border-green-600",
          status === 'upcoming' && "bg-gray-100 text-gray-500"
        )}
      >
        {status === 'complete' ? <Check size={16} /> : index + 1}
      </div>
      <span>{title}</span>
      {index < 3 && <ArrowRight size={16} className="text-gray-400" />}
    </div>
  );
};

export interface WizardStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  allStepsValid: boolean[];
}

export const WizardSteps: React.FC<WizardStepsProps> = ({ 
  currentStep, 
  onStepChange,
  allStepsValid
}) => {
  const steps = [
    { title: "Select Product" },
    { title: "Add Text" },
    { title: "Style & Color" },
    { title: "Review & Order" }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200">
      {steps.map((step, index) => {
        let status: 'upcoming' | 'current' | 'complete' = 'upcoming';
        
        if (index === currentStep) {
          status = 'current';
        } else if (index < currentStep || (index <= currentStep && allStepsValid[index])) {
          status = 'complete';
        }
        
        return (
          <WizardStep
            key={index}
            index={index}
            title={step.title}
            status={status}
            onClick={() => {
              // Only allow navigation to completed steps or the next available step
              if (status === 'complete' || index === currentStep + 1) {
                onStepChange(index);
              }
            }}
          />
        );
      })}
    </div>
  );
};
