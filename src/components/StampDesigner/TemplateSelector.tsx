
import React from "react";
import { ProductShape } from "@/types";

interface TemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
  productShape: ProductShape;
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
