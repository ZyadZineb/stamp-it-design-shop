
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StampDesign, StampTextLine } from '@/types';

interface DesignTemplatesProps {
  onSelectTemplate: (template: Partial<StampDesign>) => void;
  productShape: 'rectangle' | 'circle' | 'square';
}

const DesignTemplates: React.FC<DesignTemplatesProps> = ({ onSelectTemplate, productShape }) => {
  // Define sample design templates with proper type alignment
  const templates: { 
    id: string;
    name: string;
    description: string;
    forShapes: ('rectangle' | 'circle' | 'square')[];
    template: Partial<StampDesign>;
  }[] = [
    {
      id: 'business',
      name: 'Business Address',
      description: 'Perfect for company address stamps',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'single',
        lines: [
          {
            text: 'COMPANY NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false
          },
          {
            text: '123 Business Street',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false
          },
          {
            text: 'City, State 12345',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'signature',
      name: 'Signature',
      description: 'For document signing and approvals',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'APPROVED',
            fontSize: 20,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false
          },
          {
            text: 'Date: ___________',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false
          }
        ],
        inkColor: 'red',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'circular',
      name: 'Circular Stamp',
      description: 'Professional round stamp layout',
      forShapes: ['circle'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'OFFICIAL STAMP',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false
          },
          {
            text: 'COMPANY NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false
          },
          {
            text: 'ESTABLISHED 2022',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoX: 0,
        logoY: 0
      }
    }
  ];

  // Filter templates based on product shape
  const filteredTemplates = templates.filter(template => 
    template.forShapes.includes(productShape)
  );

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Design Templates</h3>
      <p className="text-sm text-gray-500">Start with a template and customize it to your needs.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3" 
                onClick={() => onSelectTemplate(template.template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {filteredTemplates.length === 0 && (
          <p className="text-sm text-gray-500 col-span-2">
            No templates available for this stamp shape.
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignTemplates;
