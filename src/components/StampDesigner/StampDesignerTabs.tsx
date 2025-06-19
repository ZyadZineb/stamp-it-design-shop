
import React from "react";
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TemplateSelector from './TemplateSelector';
import LogoUploader from './LogoUploader';
import TextEditor from './TextEditor';
import BorderSelector from './BorderSelector';
import ColorSelector from './ColorSelector';
import WhatsAppOrderFlow from './WhatsAppOrderFlow';

type StepType = 'templates' | 'logo' | 'text' | 'border' | 'color' | 'preview';

interface StampDesignerTabsProps {
  currentStep: StepType;
  setCurrentStep: (step: StepType) => void;
  product: Product | null;
  design: any;
  designer: any;
  convertShapeForTemplateSelector: (shape: string) => 'rectangle' | 'circle' | 'oval';
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerTabs: React.FC<StampDesignerTabsProps> = ({
  currentStep,
  setCurrentStep,
  product,
  design,
  designer,
  convertShapeForTemplateSelector,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();

  const {
    updateLine,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    setBorderStyle,
    setBorderThickness,
    toggleCurvedText,
    startTextDrag,
    applyTemplate,
    enhancedAutoArrange,
    setGlobalAlignment
  } = designer;

  return (
    <Tabs defaultValue={currentStep} value={currentStep} onValueChange={(value) => setCurrentStep(value as StepType)}>
      <TabsList className="w-full justify-start mb-4 overflow-x-auto">
        <TabsTrigger value="templates" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.templates', "Templates")}
        </TabsTrigger>
        <TabsTrigger value="logo" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.logo', "Logo")}
        </TabsTrigger>
        <TabsTrigger value="text" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.text', "Text")}
        </TabsTrigger>
        <TabsTrigger value="border" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.border', "Border")}
        </TabsTrigger>
        <TabsTrigger value="color" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.color', "Color")}
        </TabsTrigger>
        <TabsTrigger value="preview" className={largeControls ? "text-lg py-3 px-5 min-h-[44px]" : "min-h-[44px]"}>
          {t('steps.preview', "Order")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="templates">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('templates.title', "Choose a Template")}</h2>
            <p className="text-gray-600 mb-6">{t('templates.description', "Start with a pre-designed template or create your own from scratch.")}</p>
            <TemplateSelector 
              onSelectTemplate={applyTemplate} 
              productShape={convertShapeForTemplateSelector(design.shape)}
              highContrast={highContrast}
              largeControls={largeControls}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logo">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('logo.title', "Add Your Logo")}</h2>
            <p className="text-gray-600 mb-6">{t('logo.description', "Upload and position your logo or skip this step.")}</p>
            <LogoUploader 
              includeLogo={design.includeLogo}
              logoImage={design.logoImage}
              logoPosition={design.logoPosition}
              onToggleLogo={toggleLogo}
              onLogoUpload={applyTemplate}
              onPositionChange={setLogoPosition}
              highContrast={highContrast}
              largeControls={largeControls}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="text">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('text.title', "Add Your Text")}</h2>
            <p className="text-gray-600 mb-6">{t('text.description', "Enter the text for your stamp and customize the font and style.")}</p>
            <TextEditor 
              lines={design.lines}
              onUpdateLine={updateLine}
              onAddLine={addLine}
              onRemoveLine={removeLine}
              onToggleCurvedText={toggleCurvedText}
              onStartTextDrag={startTextDrag}
              maxLines={product?.lines || 5}
              shape={design.shape}
              onAutoArrange={enhancedAutoArrange}
              onSetGlobalAlignment={setGlobalAlignment}
              highContrast={highContrast}
              largeControls={largeControls}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="border">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('border.title', "Choose Border Style")}</h2>
            <p className="text-gray-600 mb-6">{t('border.description', "Select a border style for your stamp.")}</p>
            <BorderSelector 
              borderStyle={design.borderStyle}
              borderThickness={design.borderThickness}
              onSetBorderStyle={setBorderStyle}
              onSetBorderThickness={setBorderThickness}
              shape={design.shape}
              highContrast={highContrast}
              largeControls={largeControls}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="color">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('color.title', "Choose Ink Color")}</h2>
            <p className="text-gray-600 mb-6">{t('color.description', "Select the ink color for your stamp.")}</p>
            <ColorSelector 
              availableColors={product?.inkColors || []}
              selectedColor={design.inkColor}
              onColorSelect={setInkColor}
              highContrast={highContrast}
              largeControls={largeControls}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{t('preview.title', "Order Your Stamp")}</h2>
            <p className="text-gray-600 mb-6">{t('preview.description', "Review your stamp design and order via WhatsApp.")}</p>
            
            <WhatsAppOrderFlow 
              product={product}
              previewImage={designer.previewImage}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StampDesignerTabs;
