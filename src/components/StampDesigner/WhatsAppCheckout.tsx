
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Product } from '@/types';

interface WhatsAppCheckoutProps {
  product: Product | null;
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    deliveryAddress: string;
  };
  previewImage: string | null;
  onValidationError: (errors: { [key: string]: string }) => void;
}

const WhatsAppCheckout: React.FC<WhatsAppCheckoutProps> = ({
  product,
  customerInfo,
  previewImage,
  onValidationError
}) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  // WhatsApp business number (replace with actual number)
  const WHATSAPP_NUMBER = '212600000000'; // Replace with real business WhatsApp number

  const validateCustomerInfo = () => {
    const errors: { [key: string]: string } = {};

    if (!customerInfo.fullName.trim()) {
      errors.fullName = t('checkout.errors.fullNameRequired', 'Full name is required');
    }

    if (Object.keys(errors).length > 0) {
      onValidationError(errors);
      return false;
    }

    onValidationError({});
    return true;
  };

  const generateWhatsAppMessage = () => {
    const orderDetails = [
      '🛠️ New Custom Stamp Order',
      '',
      `👤 Name: ${customerInfo.fullName}`,
    ];

    if (customerInfo.phoneNumber) {
      orderDetails.push(`📞 Phone: ${customerInfo.phoneNumber}`);
    }

    if (customerInfo.deliveryAddress) {
      orderDetails.push(`📍 Address: ${customerInfo.deliveryAddress}`);
    }

    if (product) {
      orderDetails.push(`📬 Model: ${product.name} (${product.size})`);
      orderDetails.push(`💰 Price: ${product.price} DHS`);
    }

    orderDetails.push('');
    orderDetails.push('🎨 Design Preview: Please see attached image');
    orderDetails.push('');
    orderDetails.push('Please confirm this order and let me know the delivery timeline. Thank you!');

    return orderDetails.join('\n');
  };

  const copyMessageToClipboard = async () => {
    try {
      const message = generateWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      toast({
        title: t('checkout.messageCopied', 'Message Copied'),
        description: t('checkout.messageCopiedDesc', 'Order details copied to clipboard'),
        action: <CheckCircle className="w-4 h-4 text-green-500" />
      });
    } catch (error) {
      toast({
        title: t('checkout.copyError', 'Copy Failed'),
        description: t('checkout.copyErrorDesc', 'Could not copy message to clipboard'),
        variant: 'destructive'
      });
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!validateCustomerInfo()) {
      return;
    }

    setIsProcessing(true);

    try {
      const message = generateWhatsAppMessage();
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');

      toast({
        title: t('checkout.whatsappOpened', 'WhatsApp Opened'),
        description: t('checkout.whatsappOpenedDesc', 'WhatsApp opened — send the message to place your order.'),
        action: <MessageCircle className="w-4 h-4 text-green-500" />
      });

      // Optional: Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'whatsapp_order_click', {
          event_category: 'checkout',
          event_label: product?.id || 'unknown'
        });
      }

    } catch (error) {
      console.error('WhatsApp order error:', error);
      toast({
        title: t('checkout.whatsappError', 'WhatsApp Error'),
        description: t('checkout.whatsappErrorDesc', 'Could not open WhatsApp. Please try copying the message instead.'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleWhatsAppOrder}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        {isProcessing 
          ? t('checkout.processing', 'Processing...') 
          : t('checkout.orderViaWhatsApp', '📩 Order via WhatsApp')
        }
      </Button>

      <Button
        onClick={copyMessageToClipboard}
        variant="outline"
        className="w-full"
        size="sm"
      >
        <Copy className="w-4 h-4 mr-2" />
        {t('checkout.copyMessage', 'Copy Message')}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        {t('checkout.whatsappInstructions', 'Click the button to open WhatsApp with your order details pre-filled.')}
      </p>
    </div>
  );
};

export default WhatsAppCheckout;
