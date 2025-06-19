
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product, StampTextLine } from '@/types';
import { useStampCart } from '@/contexts/StampCartContext';

interface WhatsAppMessageTemplateProps {
  product: Product | null;
  design: {
    lines: StampTextLine[];
    inkColor: string;
    includeLogo: boolean;
    logoPosition: string;
    borderStyle: string;
    borderThickness: number;
    shape: string;
  };
  previewImage: string | null;
}

const WhatsAppMessageTemplate: React.FC<WhatsAppMessageTemplateProps> = ({
  product,
  design,
  previewImage
}) => {
  const { t } = useTranslation();
  const { customerInfo } = useStampCart();

  const generateComprehensiveWhatsAppMessage = () => {
    if (!product) return '';

    const orderDetails = [
      '🛠️ CUSTOM STAMP ORDER REQUEST',
      '',
      '👤 CUSTOMER INFORMATION:',
      `Name: ${customerInfo.fullName || '[Please provide your name]'}`,
    ];

    if (customerInfo.phoneNumber) {
      orderDetails.push(`Phone: ${customerInfo.phoneNumber}`);
    }

    if (customerInfo.deliveryAddress) {
      orderDetails.push(`Delivery Address: ${customerInfo.deliveryAddress}`);
    }

    orderDetails.push('');
    orderDetails.push('🏷️ STAMP SPECIFICATIONS:');
    orderDetails.push(`Model: ${product.name}`);
    orderDetails.push(`Size: ${product.size}`);
    orderDetails.push(`Price: ${product.price} DHS`);
    orderDetails.push(`Shape: ${design.shape}`);
    orderDetails.push(`Ink Color: ${design.inkColor}`);

    // Text content details
    const activeLines = design.lines.filter(line => line.text.trim());
    if (activeLines.length > 0) {
      orderDetails.push('');
      orderDetails.push('📝 TEXT CONTENT:');
      activeLines.forEach((line, index) => {
        const styleDetails = [];
        if (line.fontFamily) styleDetails.push(`Font: ${line.fontFamily.split(',')[0]}`);
        if (line.fontSize) styleDetails.push(`Size: ${line.fontSize}px`);
        if (line.alignment) styleDetails.push(`Align: ${line.alignment}`);
        if (line.bold) styleDetails.push('Bold');
        if (line.italic) styleDetails.push('Italic');
        if (line.letterSpacing && line.letterSpacing > 0) {
          styleDetails.push(`Letter Spacing: ${line.letterSpacing}px`);
        }
        
        orderDetails.push(`  Line ${index + 1}: "${line.text}"`);
        if (styleDetails.length > 0) {
          orderDetails.push(`    Style: ${styleDetails.join(', ')}`);
        }
      });
    }

    // Logo details
    if (design.includeLogo) {
      orderDetails.push('');
      orderDetails.push(`🖼️ LOGO: Included (Position: ${design.logoPosition})`);
    }

    // Border details
    if (design.borderStyle !== 'none') {
      orderDetails.push('');
      orderDetails.push(`🔲 BORDER: ${design.borderStyle} style, ${design.borderThickness}px thickness`);
    }

    orderDetails.push('');
    orderDetails.push('🎨 Design preview will be sent separately');
    orderDetails.push('');
    orderDetails.push('Please confirm this order and provide delivery timeline.');
    orderDetails.push('Thank you for choosing our custom stamp service! 🙏');

    return orderDetails.join('\n');
  };

  const openWhatsApp = () => {
    const message = generateComprehensiveWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '212699118028';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
  };

  const copyToClipboard = async () => {
    const message = generateComprehensiveWhatsAppMessage();
    try {
      await navigator.clipboard.writeText(message);
      return true;
    } catch (error) {
      console.error('Failed to copy message:', error);
      return false;
    }
  };

  return {
    generateMessage: generateComprehensiveWhatsAppMessage,
    openWhatsApp,
    copyToClipboard
  };
};

export default WhatsAppMessageTemplate;
