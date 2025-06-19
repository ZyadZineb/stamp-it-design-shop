
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

  const generateComprehensiveWhatsAppMessage = () => {
    const orderDetails = [
      '🛠️ CUSTOM STAMP ORDER',
      '',
      `👤 Customer Information:`,
      `Name: ${customerInfo.fullName}`,
    ];

    if (customerInfo.phoneNumber) {
      orderDetails.push(`Phone: ${customerInfo.phoneNumber}`);
    }

    if (customerInfo.deliveryAddress) {
      orderDetails.push(`Delivery Address: ${customerInfo.deliveryAddress}`);
    }

    orderDetails.push('');
    orderDetails.push('📦 ORDER DETAILS:');
    orderDetails.push(`Total Stamps: ${getItemCount()}`);
    orderDetails.push(`Total Amount: ${getTotalPrice()} DHS`);
    orderDetails.push('');

    cartItems.forEach((item, index) => {
      orderDetails.push(`🏷️ STAMP ${index + 1}:`);
      orderDetails.push(`Model: ${item.product.name} (${item.product.size})`);
      orderDetails.push(`Quantity: ${item.quantity} × ${item.product.price} DHS = ${item.quantity * item.product.price} DHS`);
      orderDetails.push(`Ink Color: ${item.inkColor}`);
      orderDetails.push(`Shape: ${item.shape}`);
      
      // Detailed text formatting
      const activeLines = item.customText.filter(line => line.text.trim());
      if (activeLines.length > 0) {
        orderDetails.push(`📝 Text Content:`);
        activeLines.forEach((line, lineIndex) => {
          const styleDetails = [];
          if (line.fontFamily) styleDetails.push(`Font: ${line.fontFamily.split(',')[0]}`);
          if (line.fontSize) styleDetails.push(`Size: ${line.fontSize}px`);
          if (line.alignment) styleDetails.push(`Align: ${line.alignment}`);
          if (line.bold) styleDetails.push('Bold');
          if (line.italic) styleDetails.push('Italic');
          if (line.letterSpacing && line.letterSpacing > 0) styleDetails.push(`Letter Spacing: ${line.letterSpacing}px`);
          
          orderDetails.push(`  Line ${lineIndex + 1}: "${line.text}"`);
          if (styleDetails.length > 0) {
            orderDetails.push(`  Style: ${styleDetails.join(', ')}`);
          }
        });
      }
      
      // Logo details
      if (item.includeLogo && item.logoImage) {
        orderDetails.push(`🖼️ Logo: Included (Position: ${item.logoPosition})`);
      }
      
      // Border details
      if (item.borderStyle !== 'none') {
        orderDetails.push(`🔲 Border: ${item.borderStyle} style, ${item.borderThickness}px thickness`);
      }
      
      orderDetails.push(''); // Space between items
    });

    orderDetails.push('🎨 Design previews will be sent separately');
    orderDetails.push('');
    orderDetails.push('Please confirm this order and provide delivery timeline.');
    orderDetails.push('Thank you for choosing our custom stamp service! 🙏');

    return orderDetails.join('\n');
  };

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
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const copyOrderMessageToClipboard = async () => {
    if (!validateCustomerInfo()) {
      toast({
        title: "❌ Validation Error",
        description: "Please fill in all required fields",
        variant: 'destructive'
      });
      return;
    }

    setIsCopying(true);
    try {
      const message = generateComprehensiveWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      toast({
        title: "✅ Order Message Copied",
        description: "Complete order details copied to clipboard",
        action: <CheckCircle className="w-4 h-4 text-green-500" />
      });
    } catch (error) {
      toast({
        title: t('checkout.copyError', 'Copy Failed'),
        description: t('checkout.copyErrorDesc', 'Could not copy to clipboard'),
        variant: 'destructive'
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleWhatsAppOrderSubmission = async () => {
    if (!validateCustomerInfo()) {
      toast({
        title: "❌ Missing Information",
        description: "Please enter your full name before proceeding",
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const comprehensiveMessage = generateComprehensiveWhatsAppMessage();
      console.log('Generated comprehensive WhatsApp message:', comprehensiveMessage);
      
      const encodedMessage = encodeURIComponent(comprehensiveMessage);
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      console.log('Opening WhatsApp with URL:', whatsappURL);

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');

      toast({
        title: "✅ WhatsApp Opened Successfully",
        description: "WhatsApp launched with your complete order — please send the message to finalize your order.",
        action: <MessageCircle className="w-4 h-4 text-green-500" />,
        duration: 6000
      });

      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'whatsapp_order_sent', {
          event_category: 'checkout',
          event_label: `${getItemCount()}_stamps`,
          value: getTotalPrice()
        });
      }

    } catch (error) {
      console.error('WhatsApp order error:', error);
      toast({
        title: "❌ WhatsApp Launch Error",
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
          <p className="text-gray-600">No stamps in cart to checkout</p>
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
            📩 Complete Your Order via WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Order Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 text-lg">📦 Order Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Stamps:</span>
                <span className="font-medium ml-2">{getItemCount()} items</span>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg text-green-600 ml-2">{getTotalPrice()} DHS</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Models: {cartItems.map(item => `${item.product.name} (×${item.quantity})`).join(', ')}
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">👤 Customer Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="checkout-fullName">
                Full Name * <span className="text-red-500">(Required for order processing)</span>
              </label>
              <input
                id="checkout-fullName"
                type="text"
                value={customerInfo.fullName}
                onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                className={`w-full min-h-[44px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="checkout-phoneNumber">
                Phone Number <span className="text-gray-500">(For delivery coordination)</span>
              </label>
              <input
                id="checkout-phoneNumber"
                type="tel"
                value={customerInfo.phoneNumber}
                onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+212 6XX XXX XXX"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="checkout-deliveryAddress">
                Delivery Address <span className="text-gray-500">(Complete address for shipping)</span>
              </label>
              <textarea
                id="checkout-deliveryAddress"
                value={customerInfo.deliveryAddress}
                onChange={(e) => handleCustomerInfoChange('deliveryAddress', e.target.value)}
                className="w-full min-h-[88px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Street address, city, postal code"
                rows={3}
              />
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppOrderSubmission}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white min-h-[50px] text-lg font-semibold shadow-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('checkout.processing', 'Opening WhatsApp...')}
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  📩 {t('checkout.sendOrderViaWhatsApp', 'Send Complete Order via WhatsApp')}
                </>
              )}
            </Button>

            <Button
              onClick={copyOrderMessageToClipboard}
              disabled={isCopying}
              variant="outline"
              className="w-full min-h-[44px] border-green-200 hover:bg-green-50"
              size="sm"
            >
              {isCopying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Copying Order Details...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('checkout.copyMessage', 'Copy Complete Order Message')}
                </>
              )}
            </Button>
          </div>

          {/* Helpful Instructions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">✅ What happens next:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Click the WhatsApp button to open with your complete order details</li>
              <li>2. Your order includes all stamps, text formatting, and customer info</li>
              <li>3. Send the pre-filled message to complete your order</li>
              <li>4. We'll confirm your order and provide delivery timeline</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCartCheckout;
