
import { StampDesign } from '../types';

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  design: StampDesign;
}

export const stampTemplates: DesignTemplate[] = [
  {
    id: 'business-address',
    name: 'Business Address',
    description: 'Classic company address stamp',
    preview: '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png',
    design: {
      lines: [
        {
          text: 'COMPANY NAME LLC',
          fontSize: 18,
          fontFamily: 'Arial',
          bold: true,
          italic: false,
          alignment: 'center',
          xPosition: 0,
          yPosition: -40
        },
        {
          text: '123 Business Street',
          fontSize: 14,
          fontFamily: 'Arial',
          bold: false,
          italic: false,
          alignment: 'center',
          xPosition: 0,
          yPosition: 0
        },
        {
          text: 'City, State 12345',
          fontSize: 14,
          fontFamily: 'Arial',
          bold: false,
          italic: false,
          alignment: 'center',
          xPosition: 0,
          yPosition: 40
        }
      ],
      inkColor: 'blue',
      includeLogo: false,
      logoPosition: 'top',
      logoX: 0,
      logoY: 0,
      logoDragging: false,
      shape: 'rectangle',
      borderStyle: 'single'
    }
  },
  {
    id: 'signature',
    name: 'Signature Line',
    description: 'Signature approval stamp',
    preview: '/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png',
    design: {
      lines: [
        {
          text: 'APPROVED',
          fontSize: 20,
          fontFamily: 'Impact',
          bold: true,
          italic: false,
          alignment: 'center',
          xPosition: 0,
          yPosition: -30
        },
        {
          text: 'Signature:',
          fontSize: 12,
          fontFamily: 'Arial',
          bold: false,
          italic: false,
          alignment: 'left',
          xPosition: -50,
          yPosition: 20
        },
        {
          text: 'Date:',
          fontSize: 12,
          fontFamily: 'Arial',
          bold: false,
          italic: false,
          alignment: 'left',
          xPosition: -50,
          yPosition: 50
        }
      ],
      inkColor: 'red',
      includeLogo: false,
      logoPosition: 'top',
      logoX: 0,
      logoY: 0,
      logoDragging: false,
      shape: 'rectangle',
      borderStyle: 'double'
    }
  },
  {
    id: 'circular-seal',
    name: 'Circular Seal',
    description: 'Official seal stamp',
    preview: '/lovable-uploads/ef68040b-498e-4d2f-a69f-f379ff643c4b.png',
    design: {
      lines: [
        {
          text: 'OFFICIAL DOCUMENT',
          fontSize: 14,
          fontFamily: 'Times New Roman',
          bold: true,
          italic: false,
          alignment: 'center',
          curved: true,
          xPosition: 0,
          yPosition: -40
        },
        {
          text: 'CERTIFIED',
          fontSize: 16,
          fontFamily: 'Times New Roman',
          bold: true,
          italic: false,
          alignment: 'center',
          xPosition: 0,
          yPosition: 0
        },
        {
          text: 'ESTABLISHED 2025',
          fontSize: 12,
          fontFamily: 'Times New Roman',
          bold: false,
          italic: false,
          alignment: 'center',
          curved: true,
          xPosition: 0,
          yPosition: 40
        }
      ],
      inkColor: 'blue',
      includeLogo: false,
      logoPosition: 'center',
      logoX: 0,
      logoY: 0,
      logoDragging: false,
      shape: 'circle',
      borderStyle: 'double'
    }
  }
];

export const getTemplateById = (id: string): DesignTemplate | undefined => {
  return stampTemplates.find(template => template.id === id);
};
