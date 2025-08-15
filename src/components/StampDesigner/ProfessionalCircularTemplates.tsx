import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StampDesign, StampTextLine } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfessionalCircularTemplatesProps {
  onApplyTemplate: (template: Partial<StampDesign>) => void;
}

const createLine = (text: string, overrides: Partial<StampTextLine> = {}): StampTextLine => ({
  id: crypto.randomUUID(),
  text,
  align: 'center',
  fontFamily: 'Arial',
  fontSizePt: 16,
  letterSpacing: 0,
  lineSpacing: 0,
  fontSize: 16,
  bold: false,
  italic: false,
  alignment: 'center',
  curved: false,
  xPosition: 0,
  yPosition: 0,
  isDragging: false,
  ...overrides,
});

const ProfessionalCircularTemplates: React.FC<ProfessionalCircularTemplatesProps> = ({ onApplyTemplate }) => {
  const { t } = useTranslation();
  const [category, setCategory] = React.useState('business');

  const professionalTemplates = [
    // Business templates
    {
      id: 'officialCircular',
      name: 'Official Circular Stamp',
      description: 'Professional circular stamp with curved text border and centered lines',
      category: 'business',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('OFFICIAL SEAL * PROFESSIONAL STAMP *', {
            fontSizePt: 16,
            fontSize: 16,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 1
          }),
          createLine('COMPANY NAME', {
            fontSizePt: 20,
            fontSize: 20,
            bold: true,
            yPosition: -15
          }),
          createLine('123 BUSINESS STREET', {
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 5
          }),
          createLine('CITY, STATE 12345', {
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 20
          }),
          createLine('EST. 2024', {
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 1
          })
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -40,
        elements: []
      }
    },
    {
      id: 'businessAddress',
      name: 'Business Address',
      description: 'Clean professional address stamp layout',
      category: 'business',
      template: {
        borderStyle: 'solid' as const,
        lines: [
          createLine('* BUSINESS NAME * ESTABLISHED 2024 *', {
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('JOHN SMITH', {
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('123 BUSINESS AVENUE', {
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('CONTACT: (123) 456-7890 * EMAIL@EXAMPLE.COM', {
            fontSizePt: 12,
            fontSize: 12,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'black',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    {
      id: 'corporateSeal',
      name: 'Corporate Seal',
      description: 'Formal corporate seal with professional layout',
      category: 'business',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('CORPORATE SEAL * AUTHENTIC DOCUMENT *', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('CORPORATION NAME', {
            fontFamily: 'Times New Roman',
            fontSizePt: 20,
            fontSize: 20,
            bold: true,
            yPosition: -15
          }),
          createLine('INCORPORATED', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 5,
            letterSpacing: 0.5
          }),
          createLine('REGISTERED: 00/00/0000', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    
    // Legal templates
    {
      id: 'notarySeal',
      name: 'Notary Seal',
      description: 'Professional notary seal with state text and commission details',
      category: 'legal',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('* NOTARY PUBLIC * STATE OF JURISDICTION *', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('NOTARY NAME', {
            fontFamily: 'Times New Roman',
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('COMMISSION #000000', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            yPosition: 10
          }),
          createLine('MY COMMISSION EXPIRES 00/00/0000', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.5
          })
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: 0,
        elements: []
      }
    },
    {
      id: 'certifiedCopy',
      name: 'Certified Copy',
      description: 'Professional stamp for document certification',
      category: 'legal',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('* CERTIFIED TRUE COPY * OFFICIAL DOCUMENT *', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('CERTIFIED', {
            fontFamily: 'Times New Roman',
            fontSizePt: 20,
            fontSize: 20,
            bold: true,
            yPosition: -10,
            letterSpacing: 1
          }),
          createLine('DATE: _______________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 15
          }),
          createLine('ATTORNEY SIGNATURE: _______________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            yPosition: 35
          })
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: 0,
        elements: []
      }
    },
    {
      id: 'witnessedSignature',
      name: 'Witnessed Signature',
      description: 'Professional stamp for witnessing signatures',
      category: 'legal',
      template: {
        borderStyle: 'solid' as const,
        lines: [
          createLine('* WITNESSED * AUTHENTIC SIGNATURE *', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('SIGNATURE WITNESSED BY', {
            fontFamily: 'Times New Roman',
            fontSizePt: 16,
            fontSize: 16,
            bold: true,
            yPosition: -10
          }),
          createLine('NAME: _______________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('DATE: __/__/____ * ID: __________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Medical templates
    {
      id: 'medicalPractice',
      name: 'Medical Practice',
      description: 'Professional stamp for medical documents',
      category: 'medical',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('* MEDICAL PRACTICE * CONFIDENTIAL *', {
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('DR. FULL NAME', {
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('LICENSE #: 000000', {
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('MEDICAL SPECIALTY * NPI #: 0000000000', {
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      description: 'Professional stamp for pharmacy use',
      category: 'medical',
      template: {
        borderStyle: 'solid' as const,
        lines: [
          createLine('* PHARMACY * PRESCRIPTION VERIFIED *', {
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('PHARMACY NAME', {
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('VERIFIED BY: _______________', {
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('DATE: __/__/____ * TIME: __:__ AM/PM', {
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Educational templates
    {
      id: 'schoolLibrary',
      name: 'School Library',
      description: 'Professional stamp for school library use',
      category: 'education',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('* SCHOOL LIBRARY * PROPERTY OF *', {
            fontFamily: 'Georgia',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('SCHOOL NAME', {
            fontFamily: 'Georgia',
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('BOOK ID: _____________', {
            fontFamily: 'Georgia',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('DUE DATE: __/__/____ * PLEASE RETURN', {
            fontFamily: 'Georgia',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    {
      id: 'studentRecord',
      name: 'Student Record',
      description: 'Professional stamp for student documents',
      category: 'education',
      template: {
        borderStyle: 'solid' as const,
        lines: [
          createLine('* STUDENT RECORDS * CONFIDENTIAL *', {
            fontFamily: 'Georgia',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('INSTITUTION NAME', {
            fontFamily: 'Georgia',
            fontSizePt: 18,
            fontSize: 18,
            bold: true,
            yPosition: -10
          }),
          createLine('VERIFIED BY: _______________', {
            fontFamily: 'Georgia',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 10
          }),
          createLine('DATE: __/__/____ * REF: __________', {
            fontFamily: 'Georgia',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Government templates
    {
      id: 'governmentOfficial',
      name: 'Government Official',
      description: 'Professional stamp for government document processing',
      category: 'government',
      template: {
        borderStyle: 'double' as const,
        lines: [
          createLine('* OFFICIAL USE ONLY * GOVERNMENT DOCUMENT *', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            bold: true,
            curved: true,
            yPosition: -40,
            letterSpacing: 0.5
          }),
          createLine('APPROVED', {
            fontFamily: 'Times New Roman',
            fontSizePt: 22,
            fontSize: 22,
            bold: true,
            yPosition: -5,
            letterSpacing: 1
          }),
          createLine('OFFICIAL: _______________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 14,
            fontSize: 14,
            yPosition: 20
          }),
          createLine('DATE: __/__/____ * REF: __________', {
            fontFamily: 'Times New Roman',
            fontSizePt: 12,
            fontSize: 12,
            bold: true,
            curved: true,
            yPosition: 40,
            letterSpacing: 0.3
          })
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -30,
        elements: []
      }
    }
  ];

  // Filter templates by category
  const filteredTemplates = React.useMemo(() => {
    return professionalTemplates.filter(template => template.category === category);
  }, [category]);

  // Categories for the tabs
  const categories = [
    { id: 'business', name: 'Business' },
    { id: 'legal', name: 'Legal' },
    { id: 'medical', name: 'Medical' },
    { id: 'education', name: 'Education' },
    { id: 'government', name: 'Government' },
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">
          {t('professionalTemplates.title', 'Professional Circular Templates')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('professionalTemplates.description', 'Choose from our professional circular stamp templates for various uses')}
        </p>
        
        <Tabs defaultValue="business" value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
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
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-2 text-center p-4 text-gray-500">
                    No templates available for this category.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCircularTemplates;