import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { StampDesign, StampTextLine } from '@/types';

interface DesignTemplatesProps {
  onSelectTemplate: (template: Partial<StampDesign>) => void;
  productShape: 'rectangle' | 'circle' | 'square';
}

interface TemplateCategory {
  id: string;
  name: string;
  nameTranslationKey?: string;
}

// Helper function to transform legacy line format to new format
const transformLine = (line: any): StampTextLine => ({
  id: crypto.randomUUID(),
  text: line.text || '',
  align: 'center' as const,
  fontSizePt: line.fontSize || 16,
  letterSpacing: line.letterSpacing || 0,
  lineSpacing: 0,
  fontSize: line.fontSize || 16,
  fontFamily: line.fontFamily || 'Arial',
  bold: line.bold || false,
  italic: line.italic || false,
  alignment: line.alignment || 'center',
  curved: line.curved || false,
  xPosition: line.xPosition || 0,
  yPosition: line.yPosition || 0,
  isDragging: line.isDragging || false,
  textPosition: line.textPosition || 'top'
});

const DesignTemplates: React.FC<DesignTemplatesProps> = ({ onSelectTemplate, productShape }) => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('business');
  
  const categories: TemplateCategory[] = [
    { id: 'business', nameTranslationKey: 'templates.categories.business', name: 'Business' },
    { id: 'legal', nameTranslationKey: 'templates.categories.legal', name: 'Legal' },
    { id: 'education', nameTranslationKey: 'templates.categories.education', name: 'Education' },
    { id: 'healthcare', nameTranslationKey: 'templates.categories.healthcare', name: 'Healthcare' },
  ];
  
  const templates = {
    business: [
      {
        id: 'simple-business',
        name: t('templates.simpleBusiness', 'Simple Business'),
        description: t('templates.simpleBusinessDesc', 'Clean and professional layout'),
        template: {
          borderStyle: 'solid' as const,
          lines: [
            transformLine({
              text: 'COMPANY NAME',
              fontSize: 18,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Your Address',
              fontSize: 12,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Phone • Email',
              fontSize: 10,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            })
          ],
          borderThickness: 2,
          inkColor: '#000000'
        }
      },
      {
        id: 'corporate-header',
        name: t('templates.corporateHeader', 'Corporate Header'),
        description: t('templates.corporateHeaderDesc', 'Professional header design'),
        template: {
          borderStyle: 'double' as const,
          lines: [
            transformLine({
              text: 'CORPORATION',
              fontSize: 20,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Established 2024',
              fontSize: 10,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            })
          ],
          borderThickness: 3,
          inkColor: '#000080'
        }
      }
    ],
    legal: [
      {
        id: 'notary-seal',
        name: t('templates.notarySeal', 'Notary Seal'),
        description: t('templates.notarySealDesc', 'Official notary stamp format'),
        template: {
          borderStyle: 'solid' as const,
          lines: [
            transformLine({
              text: 'NOTARY PUBLIC',
              fontSize: 16,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: true,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'State of Morocco',
              fontSize: 14,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Commission Expires',
              fontSize: 10,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: true,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            })
          ],
          borderThickness: 2,
          inkColor: '#000000'
        }
      }
    ],
    education: [
      {
        id: 'school-stamp',
        name: t('templates.schoolStamp', 'School Stamp'),
        description: t('templates.schoolStampDesc', 'Educational institution format'),
        template: {
          borderStyle: 'solid' as const,
          lines: [
            transformLine({
              text: 'SCHOOL NAME',
              fontSize: 16,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: true,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'APPROVED',
              fontSize: 18,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Academic Year',
              fontSize: 10,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: true,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            })
          ],
          borderThickness: 2,
          inkColor: '#000080'
        }
      }
    ],
    healthcare: [
      {
        id: 'medical-office',
        name: t('templates.medicalOffice', 'Medical Office'),
        description: t('templates.medicalOfficeDesc', 'Healthcare provider stamp'),
        template: {
          borderStyle: 'solid' as const,
          lines: [
            transformLine({
              text: 'DR. NAME',
              fontSize: 16,
              fontFamily: 'Arial',
              bold: true,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'Medical Specialist',
              fontSize: 12,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            }),
            transformLine({
              text: 'License #12345',
              fontSize: 10,
              fontFamily: 'Arial',
              bold: false,
              italic: false,
              alignment: 'center',
              curved: false,
              xPosition: 0,
              yPosition: 0,
              isDragging: false
            })
          ],
          borderThickness: 1,
          inkColor: '#000080'
        }
      }
    ]
  };

  const currentTemplates = templates[activeCategory as keyof typeof templates] || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('templates.title', 'Choose a Template')}</h2>
        <p className="text-gray-600">{t('templates.description', 'Start with a professional template or create your own design.')}</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.nameTranslationKey ? t(category.nameTranslationKey, category.name) : category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <Button
                      onClick={() => onSelectTemplate(template.template)}
                      className="w-full"
                      variant="outline"
                    >
                      {t('templates.select', 'Select Template')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Blank Template Option */}
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">{t('templates.blank', 'Start from Blank')}</h3>
          <p className="text-sm text-gray-600 mb-4">{t('templates.blankDesc', 'Create your own design from scratch')}</p>
          <Button
            onClick={() => onSelectTemplate({ lines: [] })}
            variant="outline"
          >
            {t('templates.createBlank', 'Create Blank Stamp')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignTemplates;