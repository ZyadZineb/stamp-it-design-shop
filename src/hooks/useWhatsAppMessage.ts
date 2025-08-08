
import { Product, StampDesign } from '@/types';
import { toCartShape } from '@/utils/shape';

interface WhatsAppCustomerInfo {
  fullName: string;
  phoneNumber?: string;
  deliveryAddress?: string;
}

interface UseWhatsAppMessageArgs {
  product: Product | null;
  design: StampDesign;
  customerInfo: WhatsAppCustomerInfo;
  previewImage: string | null;
  whatsappNumber?: string; // Defaults to our business number
}

export const useWhatsAppMessage = ({
  product,
  design,
  customerInfo,
  previewImage,
  whatsappNumber = '212699118028'
}: UseWhatsAppMessageArgs) => {
  const buildMessage = (): string => {
    const linesDetails = design.lines
      .filter(l => l.text?.trim())
      .map((l, idx) => `  • Line ${idx + 1}: "${l.text}" (${l.fontFamily}, ${l.fontSize}px, ${l.alignment}${l.bold ? ', bold' : ''}${l.italic ? ', italic' : ''}${l.curved ? ', curved' : ''})`)
      .join('\n');

    const parts: string[] = [];
    parts.push('🛠️ New Custom Stamp Order');
    parts.push('');
    parts.push(`👤 Name: ${customerInfo.fullName}`);
    if (customerInfo.phoneNumber) parts.push(`📞 Phone: ${customerInfo.phoneNumber}`);
    if (customerInfo.deliveryAddress) parts.push(`📍 Address: ${customerInfo.deliveryAddress}`);
    parts.push('');

    if (product) {
      parts.push(`📬 Model: ${product.name} (${product.size})`);
      if (typeof product.price !== 'undefined') parts.push(`💰 Price: ${product.price} DHS`);
    }

    parts.push('');
    parts.push('🎨 Design Details:');
    parts.push(`  • Shape: ${toCartShape(design.shape)}`);
    parts.push(`  • Ink color: ${design.inkColor}`);
    parts.push(`  • Border: ${design.borderStyle}${design.borderStyle !== 'none' ? `, ${design.borderThickness}px` : ''}`);
    parts.push(`  • Logo: ${design.includeLogo ? `Yes (position: ${design.logoPosition})` : 'No'}`);
    if (linesDetails) {
      parts.push('  • Text lines:');
      parts.push(linesDetails);
    }

    parts.push('');
    if (previewImage) {
      parts.push('📎 A preview image is attached in the conversation.');
    } else {
      parts.push('📎 Preview: Please attach the generated preview image if available.');
    }
    parts.push('');
    parts.push('Please confirm this order and share the delivery timeline. Thank you!');

    return parts.join('\n');
  };

  const openWhatsApp = () => {
    const message = buildMessage();
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const copyToClipboard = async (): Promise<boolean> => {
    try {
      const message = buildMessage();
      await navigator.clipboard.writeText(message);
      return true;
    } catch {
      return false;
    }
  };

  return { buildMessage, openWhatsApp, copyToClipboard };
};
