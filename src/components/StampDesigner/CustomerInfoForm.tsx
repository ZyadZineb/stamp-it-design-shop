
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onInfoChange: (info: CustomerInfo) => void;
  errors: { [key: string]: string };
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customerInfo,
  onInfoChange,
  errors
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    onInfoChange({
      ...customerInfo,
      [field]: value
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {t('checkout.customerInfo', 'Customer Information')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {t('checkout.fullName', 'Full Name')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder={t('checkout.fullNamePlaceholder', 'Enter your full name')}
            value={customerInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            {t('checkout.phoneNumber', 'Phone Number')}
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder={t('checkout.phoneNumberPlaceholder', '+212 6XX XXX XXX')}
            value={customerInfo.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">
            {t('checkout.deliveryAddress', 'Delivery Address')}
          </Label>
          <Textarea
            id="deliveryAddress"
            placeholder={t('checkout.deliveryAddressPlaceholder', 'Enter your complete delivery address')}
            value={customerInfo.deliveryAddress}
            onChange={(e) => handleChange('deliveryAddress', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
