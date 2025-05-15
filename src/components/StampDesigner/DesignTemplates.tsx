
import React from 'react';
import { StampDesign } from '@/types';

interface DesignTemplatesProps {
  onSelectTemplate: (template: Partial<StampDesign>) => void;
  productShape: 'rectangle' | 'circle' | 'square';
}

const DesignTemplates: React.FC<DesignTemplatesProps> = ({ 
  onSelectTemplate, 
  productShape 
}) => {
  // Sample templates based on shape
  const templates = [
    // Rectangle templates
    ...(productShape !== 'circle' ? [
      {
        name: 'Business Address',
        preview: '/lovable-uploads/ef68040b-498e-4d2f-a69f-f379ff643c4b.png',
        design: {
          borderStyle: 'single',
          lines: [
            { text: 'COMPANY NAME', fontSize: 18, fontFamily: 'Arial', bold: true, italic: false, alignment: 'center', xPosition: 0, yPosition: -25 },
            { text: '123 Business Street', fontSize: 14, fontFamily: 'Arial', bold: false, italic: false, alignment: 'center', xPosition: 0, yPosition: 0 },
            { text: 'City, Country 12345', fontSize: 14, fontFamily: 'Arial', bold: false, italic: false, alignment: 'center', xPosition: 0, yPosition: 25 }
          ],
          inkColor: 'blue',
          includeLogo: false
        }
      },
      {
        name: 'Invoice Paid',
        preview: '/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png',
        design: {
          borderStyle: 'double',
          lines: [
            { text: 'PAID', fontSize: 22, fontFamily: 'Impact', bold: true, italic: false, alignment: 'center', xPosition: 0, yPosition: 0 },
            { text: 'Date: __/__/____', fontSize: 14, fontFamily: 'Arial', bold: false, italic: false, alignment: 'center', xPosition: 0, yPosition: 30 }
          ],
          inkColor: 'red',
          includeLogo: false
        }
      }
    ] : []),
    
    // Circle templates
    ...(productShape === 'circle' ? [
      {
        name: 'Circular Seal',
        preview: '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png',
        design: {
          borderStyle: 'double',
          lines: [
            { text: 'OFFICIAL SEAL', fontSize: 16, fontFamily: 'Arial', bold: true, italic: false, alignment: 'center', curved: true, xPosition: 0, yPosition: -30 },
            { text: 'ESTABLISHED 2024', fontSize: 14, fontFamily: 'Arial', bold: false, italic: false, alignment: 'center', curved: true, xPosition: 0, yPosition: 30 },
            { text: 'COMPANY NAME', fontSize: 18, fontFamily: 'Arial', bold: true, italic: false, alignment: 'center', xPosition: 0, yPosition: 0 }
          ],
          inkColor: 'blue',
          includeLogo: true,
          logoImage: '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png',
          logoX: 0,
          logoY: 0
        }
      },
      {
        name: 'Notary Seal',
        preview: '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png',
        design: {
          borderStyle: 'single',
          lines: [
            { text: 'NOTARY PUBLIC', fontSize: 16, fontFamily: 'Times New Roman', bold: true, italic: false, alignment: 'center', curved: true, xPosition: 0, yPosition: -30 },
            { text: 'STATE OF EXAMPLE', fontSize: 14, fontFamily: 'Times New Roman', bold: false, italic: false, alignment: 'center', curved: true, xPosition: 0, yPosition: 30 },
            { text: 'Jane Doe', fontSize: 18, fontFamily: 'Script', bold: false, italic: true, alignment: 'center', xPosition: 0, yPosition: 0 }
          ],
          inkColor: 'blue',
          includeLogo: false
        }
      }
    ] : [])
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">Design Templates</h3>
      <p className="text-xs text-gray-600">Start with a template and customize it</p>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template, index) => (
          <div 
            key={index}
            onClick={() => onSelectTemplate(template.design)}
            className="border rounded-md p-2 hover:border-brand-blue cursor-pointer transition-colors"
          >
            <img 
              src={template.preview} 
              alt={template.name} 
              className="w-full h-auto mb-2" 
            />
            <p className="text-sm font-medium text-center">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignTemplates;
