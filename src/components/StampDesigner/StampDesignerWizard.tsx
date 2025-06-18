import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Eye, ShoppingCart, Wand2, Type, Image as ImageIcon, Palette, Frame, MessageCircle } from 'lucide-react';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Product } from '@/types';
import TextLinesEditor from './TextLinesEditor';
import LogoUploader from './LogoUploader';
import ColorSelector from './ColorSelector';
import BorderStyleSelector from './BorderStyleSelector';
import StampPreviewEnhanced from './StampPreviewEnhanced';
import DesignTemplates from './DesignTemplates';
import AutoArrange from './AutoArrange';
import WhatsAppOrderFlow from './WhatsAppOrderFlow';

interface StampDesignerWizardProps {
  product: Product | null;
  onAddToCart?: () => void;
  onPreview?: () => void;
  currentStep?: 'customize' | 'preview' | 'order';
}

type WizardStep = 'templates' | 'text' | 'logo' | 'style' | 'preview' | 'checkout';

const StampDesignerWizard: React.FC<StampDesignerWizardProps> = ({ 
  product, 
  onAddToCart, 
  onPreview,
  currentStep = 'customize'
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<WizardStep>('templates');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  const designer = useStampDesigner(product);

  const wizardSteps: Array<{
    id: WizardStep;
    title: string;
    icon: React.ComponentType<any>;
    description: string;
  }> = [
    {
      id: 'templates',
      title: t('wizard.templates', 'Templates'),
      icon: Wand2,
      description: t('wizard.templatesDesc', 'Choose a starting template')
    },
    {
      id: 'text',
      title: t('wizard.text', 'Text'),
      icon: Type,
      description: t('wizard.textDesc', 'Add and customize text')
    },
    {
      id: 'logo',
      title: t('wizard.logo', 'Logo'),
      icon: ImageIcon,
      description: t('wizard.logoDesc', 'Upload and position logo')
    },
    {
      id: 'style',
      title: t('wizard.style', 'Style'),
      icon: Palette,
      description: t('wizard.styleDesc', 'Colors and borders')
    },
    {
      id: 'preview',
      title: t('wizard.preview', 'Preview'),
      icon: Eye,
      description: t('wizard.previewDesc', 'Review your design')
    },
    {
      id: 'checkout',
      title: t('wizard.checkout', 'Order'),
      icon: MessageCircle,
      description: t('wizard.checkoutDesc', 'Order via WhatsApp')
    }
  ];

  const currentStepIndex = wizardSteps.findIndex(step => step.id === activeStep);
  const progress = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  const markStepCompleted = (stepId: WizardStep) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const canProceedToNext = () => {
    switch (activeStep) {
      case 'text':
        return designer.design.lines.some(line => line.text.trim().length > 0);
      case 'logo':
        return !designer.design.includeLogo || designer.design.logoImage;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      markStepCompleted(activeStep);
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < wizardSteps.length) {
        setActiveStep(wizardSteps[nextIndex].id);
      }
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setActiveStep(wizardSteps[prevIndex].id);
    }
  };

  const handleStepClick = (stepId: WizardStep) => {
    setActiveStep(stepId);
  };

  const handleTemplateSelect = (template: any) => {
    designer.applyTemplate(template);
    markStepCompleted('templates');
    // Auto-advance to text step
    setActiveStep('text');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'templates':
        return (
          <div className="space-y-6">
            <DesignTemplates
              onSelectTemplate={handleTemplateSelect}
              productShape={designer.design.shape === 'ellipse' ? 'circle' : designer.design.shape}
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-6">
            <TextLinesEditor 
              lines={designer.design.lines}
              onUpdateLine={designer.updateLine}
              onAddLine={designer.addLine}
              onRemoveLine={designer.removeLine}
              productShape={designer.design.shape}
              maxLines={product?.lines || 5}
            />
            <AutoArrange onAutoArrange={designer.enhancedAutoArrange} />
          </div>
        );

      case 'logo':
        return (
          <div className="space-y-6">
            <LogoUploader
              includeLogo={designer.design.includeLogo}
              logoImage={designer.design.logoImage}
              logoPosition={designer.design.logoPosition}
              onToggleLogo={designer.toggleLogo}
              onLogoUpload={designer.applyTemplate}
              onPositionChange={designer.setLogoPosition}
            />
          </div>
        );

      case 'style':
        return (
          <div className="space-y-6">
            <ColorSelector
              selectedColor={designer.design.inkColor}
              availableColors={product?.inkColors || ['blue', 'black', 'red']}
              onColorSelect={designer.setInkColor}
            />
            <BorderStyleSelector
              borderStyle={designer.design.borderStyle}
              borderThickness={designer.design.borderThickness || 1}
              onStyleChange={designer.setBorderStyle}
              onThicknessChange={designer.setBorderThickness}
            />
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {t('wizard.finalPreview', 'Final Preview')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('wizard.previewInstructions', 'Review your stamp design before ordering')}
              </p>
            </div>
          </div>
        );

      case 'checkout':
        return (
          <WhatsAppOrderFlow
            product={product}
            previewImage={designer.previewImage}
          />
        );

      default:
        return null;
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t('wizard.selectProduct', 'Please select a product to start designing.')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Navigation */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
            {wizardSteps.map((step, index) => {
              const isActive = step.id === activeStep;
              const isCompleted = completedSteps.has(step.id);
              const IconComponent = step.icon;
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <IconComponent size={16} />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {wizardSteps[currentStepIndex]?.title}
                    </h2>
                    <Badge variant="outline">
                      {currentStepIndex + 1} / {wizardSteps.length}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {wizardSteps[currentStepIndex]?.description}
                  </p>
                </div>

                <Separator className="mb-6" />

                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            {activeStep !== 'checkout' && (
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  variant="outline"
                  size="lg"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  {t('wizard.previous', 'Previous')}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext() || currentStepIndex === wizardSteps.length - 1}
                  size="lg"
                >
                  {t('wizard.next', 'Next')}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {t('wizard.livePreview', 'Live Preview')}
                </h3>
                <StampPreviewEnhanced
                  lines={designer.design.lines}
                  inkColor={designer.design.inkColor}
                  includeLogo={designer.design.includeLogo}
                  logoPosition={designer.design.logoPosition}
                  logoImage={designer.design.logoImage}
                  shape={designer.design.shape}
                  borderStyle={designer.design.borderStyle}
                  borderThickness={designer.design.borderThickness}
                  product={product}
                  zoomLevel={designer.zoomLevel}
                  onZoomIn={designer.zoomIn}
                  onZoomOut={designer.zoomOut}
                  onTextDrag={designer.startTextDrag}
                  onLogoDrag={designer.startLogoDrag}
                  onDrag={designer.handleDrag}
                  onStopDragging={designer.stopDragging}
                  showControls={activeStep === 'preview'}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDesignerWizard;
