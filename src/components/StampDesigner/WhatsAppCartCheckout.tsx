
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useStampCart } from '@/contexts/StampCartContext';

const WhatsAppCartCheckout: React.FC = () => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    cartItems,
    customerInfo,
    updateCustomerInfo,
    getTotalPrice,
    getItemCount,
    generateWhatsAppMessage
  } = useStampCart();

  // Updated WhatsApp business number
  const WHATSAPP_NUMBER = '212699118028';

  const validateCustomerInfo = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = t('checkout.errors.fullNameRequired', 'Full name is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    updateCustomerInfo({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const copyMessageToClipboard = async () => {
    if (!validateCustomerInfo()) return;

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
      toast({
        title: t('checkout.validationError', 'Validation Error'),
        description: t('checkout.validationErrorDesc', 'Please fill in all required fields'),
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const message = generateWhatsAppMessage();
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');

      toast({
        title: t('checkout.whatsappOpened', '✅ WhatsApp Opened'),
        description: t('checkout.whatsappOpenedDesc', 'WhatsApp launched — please send your message to finalize the order.'),
        action: <MessageCircle className="w-4 h-4 text-green-500" />
      });

      // Optional: Track analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'whatsapp_cart_order_click', {
          event_category: 'checkout',
          event_label: `${getItemCount()}_stamps`,
          value: getTotalPrice()
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

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No stamps in cart</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="text-green-600" size={20} />
            📩 Complete Your WhatsApp Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{getItemCount()} stamps</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{getTotalPrice()} DHS</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-fullName">
                Full Name *
              </label>
              <input
                id="cart-fullName"
                type="text"
                value={customerInfo.fullName}
                onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                className={`w-full min-h-[44px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                aria-describedby={errors.fullName ? "cart-fullName-error" : undefined}
              />
              {errors.fullName && (
                <p id="cart-fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-phoneNumber">
                Phone Number
              </label>
              <input
                id="cart-phoneNumber"
                type="tel"
                value={customerInfo.phoneNumber}
                onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-deliveryAddress">
                Delivery Address
              </label>
              <textarea
                id="cart-deliveryAddress"
                value={customerInfo.deliveryAddress}
                onChange={(e) => handleCustomerInfoChange('deliveryAddress', e.target.value)}
                className="w-full min-h-[88px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Enter your delivery address"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppOrder}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white min-h-[44px] text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('checkout.processing', 'Processing...')}
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  📩 {t('checkout.sendOrderViaWhatsApp', 'Send My Order via WhatsApp')}
                </>
              )}
            </Button>

            <Button
              onClick={copyMessageToClipboard}
              disabled={isCopying}
              variant="outline"
              className="w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              size="sm"
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
          </div>

          <p className="text-sm text-gray-600 text-center">
            {t('checkout.whatsappInstructions', 'Click the button to open WhatsApp with your complete order details pre-filled.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCartCheckout;
