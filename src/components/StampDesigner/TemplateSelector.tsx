
import React from "react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
  productShape: 'rectangle' | 'circle' | 'square' | 'ellipse';
  highContrast?: boolean;
  largeControls?: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = () => (
  <div>
    {/* Placeholder TemplateSelector */}
    <p>Template Selector coming soon.</p>
  </div>
);

export default TemplateSelector;
