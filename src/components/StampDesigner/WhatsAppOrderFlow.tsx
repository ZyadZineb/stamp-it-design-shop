
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import CustomerInfoForm, { CustomerInfo } from './CustomerInfoForm';
import WhatsAppCheckout from './WhatsAppCheckout';
import { Separator } from "@/components/ui/separator";

interface WhatsAppOrderFlowProps {
  product: Product | null;
  previewImage: string | null;
}

const WhatsAppOrderFlow: React.FC<WhatsAppOrderFlowProps> = ({
  product,
  previewImage
}) => {
  const { t } = useTranslation();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCustomerInfoChange = (info: CustomerInfo) => {
    setCustomerInfo(info);
    // Clear errors when user types
    if (errors.fullName && info.fullName.trim()) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  };

  const handleValidationError = (validationErrors: { [key: string]: string }) => {
    setErrors(validationErrors);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('checkout.title', 'Complete Your Order')}
        </h2>
        <p className="text-gray-600">
          {t('checkout.subtitle', 'Fill in your details and order via WhatsApp')}
        </p>
      </div>

      <CustomerInfoForm
        customerInfo={customerInfo}
        onInfoChange={handleCustomerInfoChange}
        errors={errors}
      />

      <Separator />

      <WhatsAppCheckout
        product={product}
        customerInfo={customerInfo}
        previewImage={previewImage}
        onValidationError={handleValidationError}
      />
    </div>
  );
};

export default WhatsAppOrderFlow;
