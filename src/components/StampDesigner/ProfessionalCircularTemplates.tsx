
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StampDesign, StampTextLine } from '@/types';

interface ProfessionalCircularTemplatesProps {
  onApplyTemplate: (template: Partial<StampDesign>) => void;
}

const ProfessionalCircularTemplates: React.FC<ProfessionalCircularTemplatesProps> = ({ onApplyTemplate }) => {
  const { t } = useTranslation();

  const professionalTemplates = [
    {
      id: 'officialCircular',
      name: 'Official Circular Stamp',
      description: 'Professional circular stamp with curved text border and centered lines',
      template: {
        borderStyle: 'double' as const,
        lines: [
          {
            text: 'OFFICIAL SEAL * PROFESSIONAL STAMP *',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 1
          },
          {
            text: 'COMPANY NAME',
            fontSize: 20,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -15,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: '123 BUSINESS STREET',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 5,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'CITY, STATE 12345',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 20,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'EST. 2024',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 1
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center',
        logoX: 0,
        logoY: -40
      }
    },
    {
      id: 'notarySeal',
      name: 'Notary Seal',
      description: 'Professional notary seal with state text and commission details',
      template: {
        borderStyle: 'triple' as const,
        lines: [
          {
            text: '* NOTARY PUBLIC * STATE OF JURISDICTION *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'NOTARY NAME',
            fontSize: 18,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'COMMISSION #000000',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'MY COMMISSION EXPIRES 00/00/0000',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.5
          }
        ],
        inkColor: 'blue',
        includeLogo: false
      }
    },
    {
      id: 'businessCircular',
      name: 'Business Address Stamp',
      description: 'Professional circular business address stamp with top/bottom text',
      template: {
        borderStyle: 'single' as const,
        lines: [
          {
            text: 'BUSINESS NAME * ESTABLISHED 2024',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: '123 MAIN STREET',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'CITY, STATE 12345',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'PHONE: (555) 555-5555 * EMAIL: INFO@EXAMPLE.COM',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'black',
        includeLogo: true,
        logoPosition: 'center',
        logoX: 0,
        logoY: -35
      }
    }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">
          {t('professionalTemplates.title', 'Professional Circular Templates')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('professionalTemplates.description', 'Industry-standard templates for professional circular stamps')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {professionalTemplates.map(template => (
            <div key={template.id} className="border rounded-md p-3 hover:bg-slate-50">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3">{template.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => onApplyTemplate(template.template)}
              >
                {t('professionalTemplates.apply', 'Apply Template')}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCircularTemplates;
