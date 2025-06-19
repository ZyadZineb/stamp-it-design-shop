
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
    getItemCount
  } = useStampCart();

  // Enhanced WhatsApp business number
  const WHATSAPP_NUMBER = '212699118028';

  const generateDetailedWhatsAppMessage = () => {
    const orderDetails = [
      '🛠️ New Custom Stamp Order',
      '',
      `👤 Customer: ${customerInfo.fullName}`,
    ];

    if (customerInfo.phoneNumber) {
      orderDetails.push(`📞 Phone: ${customerInfo.phoneNumber}`);
    }

    if (customerInfo.deliveryAddress) {
      orderDetails.push(`📍 Delivery: ${customerInfo.deliveryAddress}`);
    }

    orderDetails.push('');
    orderDetails.push('🧾 Stamps Ordered:');

    cartItems.forEach((item, index) => {
      orderDetails.push(`\n${index + 1}. ${item.product.name} (${item.product.size})`);
      orderDetails.push(`   • Quantity: ${item.quantity}`);
      orderDetails.push(`   • Price: ${item.product.price} DHS each`);
      orderDetails.push(`   • Ink Color: ${item.inkColor}`);
      orderDetails.push(`   • Shape: ${item.shape}`);
      
      // Add detailed text formatting info
      const textLines = item.customText.filter(line => line.text.trim());
      if (textLines.length > 0) {
        orderDetails.push(`   • Text Lines:`);
        textLines.forEach((line, lineIndex) => {
          const fontInfo = [];
          if (line.fontFamily) fontInfo.push(`Font: ${line.fontFamily.split(',')[0]}`);
          if (line.fontSize) fontInfo.push(`Size: ${line.fontSize}px`);
          if (line.bold) fontInfo.push('Bold');
          if (line.italic) fontInfo.push('Italic');
          if (line.alignment) fontInfo.push(`Align: ${line.alignment}`);
          if (line.letterSpacing) fontInfo.push(`Spacing: ${line.letterSpacing}px`);
          
          orderDetails.push(`     Line ${lineIndex + 1}: "${line.text}"`);
          if (fontInfo.length > 0) {
            orderDetails.push(`     Style: ${fontInfo.join(', ')}`);
          }
        });
      }
      
      // Logo information
      if (item.includeLogo && item.logoImage) {
        orderDetails.push(`   • Logo: Included (Position: ${item.logoPosition})`);
      }
      
      // Border information
      if (item.borderStyle !== 'none') {
        orderDetails.push(`   • Border: ${item.borderStyle} style, ${item.borderThickness}px thick`);
      }
    });

    orderDetails.push('');
    orderDetails.push(`💰 Total Amount: ${getTotalPrice()} DHS`);
    orderDetails.push(`📦 Total Items: ${getItemCount()} stamps`);
    orderDetails.push('');
    orderDetails.push('🎨 Design previews will be sent in the next message');
    orderDetails.push('');
    orderDetails.push('Please confirm this order and provide delivery timeline. Thank you!');

    return orderDetails.join('\n');
  };

  const validateCustomerInfo = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = t('checkout.errors.fullNameRequired',  'Full name is required');
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
      const message = generateDetailedWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      toast({
        title: "✅ Message Copied to Clipboard",
        description: "Complete order details copied successfully",
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
        title: "❌ Validation Error",
        description: "Please fill in all required fields before proceeding",
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const message = generateDetailedWhatsAppMessage();
      console.log('Generated WhatsApp message with full details:', message);
      
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      console.log('WhatsApp URL:', whatsappURL);

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');

      toast({
        title: "✅ WhatsApp Opened Successfully",
        description: "WhatsApp launched with your complete order details — please send the message to finalize your order.",
        action: <MessageCircle className="w-4 h-4 text-green-500" />,
        duration: 6000
      });

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'whatsapp_cart_order_complete', {
          event_category: 'checkout',
          event_label: `${getItemCount()}_stamps`,
          value: getTotalPrice()
        });
      }

    } catch (error) {
      console.error('WhatsApp order error:', error);
      toast({
        title: "❌ WhatsApp Error",
        description: "Could not open WhatsApp. Please try copying the message instead.",
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
          {/* Enhanced Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Stamps:</span>
                <span>{getItemCount()} items</span>
              </div>
              <div className="flex justify-between">
                <span>Models:</span>
                <span>{cartItems.map(item => item.product.name).join(', ')}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span>{getTotalPrice()} DHS</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Your Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-fullName">
                Full Name * (Required for order processing)
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
                required
              />
              {errors.fullName && (
                <p id="cart-fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-phoneNumber">
                Phone Number (For delivery coordination)
              </label>
              <input
                id="cart-phoneNumber"
                type="tel"
                value={customerInfo.phoneNumber}
                onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="+212 6XX XXX XXX"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cart-deliveryAddress">
                Delivery Address (Complete address for shipping)
              </label>
              <textarea
                id="cart-deliveryAddress"
                value={customerInfo.deliveryAddress}
                onChange={(e) => handleCustomerInfoChange('deliveryAddress', e.target.value)}
                className="w-full min-h-[88px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="Street address, city, postal code"
                rows={3}
              />
            </div>
          </div>

          {/* Enhanced Action Buttons */}
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
                  {t('checkout.processing', 'Processing Order...')}
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  📩 {t('checkout.sendOrderViaWhatsApp', 'Send Complete Order via WhatsApp')}
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
                  Copying Message...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('checkout.copyMessage', 'Copy Full Order Message')}
                </>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>✅ What happens next:</strong><br/>
              1. Click the WhatsApp button to open with your complete order<br/>
              2. Your order details (products, text, formatting) are pre-filled<br/>
              3. Send the message to complete your order<br/>
              4. We'll confirm and provide delivery timeline
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCartCheckout;
