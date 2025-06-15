
import React from 'react';
import { Product } from '@/types';

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

interface StepNavigationHeaderProps {
  product: Product;
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  getStepInfo: (step: StepType) => { title: string; description: string; icon: string };
}

const steps: StepType[] = ['templates', 'logo', 'text', 'border', 'color', 'preview'];

const StepNavigationHeader: React.FC<StepNavigationHeaderProps> = ({
  product, currentStep, setCurrentStep, getStepInfo
}) => (
  <div className="flex-shrink-0 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Créateur de Tampon Professionnel</h2>
        <p className="text-blue-700 font-medium">
          <span className="bg-blue-100 px-2 py-1 rounded-full text-sm">
            {product.name} • {product.size}
          </span>
        </p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-blue-600">{product.price} DHS</div>
        <div className="text-sm text-gray-600">TTC</div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepInfo = getStepInfo(step);
          const isActive = currentStep === step;
          const isCompleted = steps.indexOf(currentStep) > index;
          return (
            <div 
              key={step}
              className={`flex-1 text-center cursor-pointer transition-all duration-200 ${isActive ? 'transform scale-105' : ''}`}
              onClick={() => setCurrentStep(step)}
            >
              <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : isActive 
                  ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-200' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}>
                {isCompleted ? '✓' : stepInfo.icon}
              </div>
              <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {stepInfo.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default StepNavigationHeader;
