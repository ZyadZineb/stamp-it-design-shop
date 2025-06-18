import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, CheckCircle, Loader2 } from 'lucide-react';
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
  const [isCopying, setIsCopying] = useState(false);

  // Updated WhatsApp business number
  const WHATSAPP_NUMBER = '212699118028';

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
    if (previewImage) {
      orderDetails.push('🎨 Design Preview: Please see attached image');
    } else {
      orderDetails.push('🎨 Design: Custom stamp design (attach preview image if needed)');
    }
    orderDetails.push('');
    orderDetails.push('Please confirm this order and let me know the delivery timeline. Thank you!');

    return orderDetails.join('\n');
  };

  const copyMessageToClipboard = async () => {
    setIsCopying(true);
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
    } finally {
      setIsCopying(false);
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
        className="w-full bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        size="lg"
        aria-label={isProcessing ? t('checkout.processing', 'Processing...') : t('checkout.orderViaWhatsApp', '📩 Order via WhatsApp')}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t('checkout.processing', 'Processing...')}
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5 mr-2" />
            📩 {t('checkout.orderViaWhatsApp', 'Order via WhatsApp')}
          </>
        )}
      </Button>

      <Button
        onClick={copyMessageToClipboard}
        disabled={isCopying}
        variant="outline"
        className="w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        size="sm"
        aria-label={isCopying ? 'Copying message...' : t('checkout.copyMessage', 'Copy Message')}
      >
        {isCopying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Copying...
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            {t('checkout.copyMessage', 'Copy Message')}
          </>
        )}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        {t('checkout.whatsappInstructions', 'Click the button to open WhatsApp with your order details pre-filled.')}
      </p>
    </div>
  );
};

export default WhatsAppCheckout;
