
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StampDesigner from '../components/StampDesigner';
import { getProductById, products } from '../data/products';
import { Product } from '../types';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Home } from 'lucide-react';

const DesignStamp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentStep, setCurrentStep] = useState<'customize' | 'preview' | 'order'>('customize');
  
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');

  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productId]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const product = getProductById(id);
    if (product) {
      setSelectedProduct(product);
      navigate(`/design?productId=${id}`);
      setCurrentStep('customize');
    } else {
      setSelectedProduct(null);
    }
  };

  const handleAddToCart = () => {
    setCurrentStep('order');
  };

  const handlePreview = () => {
    setCurrentStep('preview');
  };

  const handleBackToCustomize = () => {
    setCurrentStep('customize');
  };

  const steps = [
    {
      id: 'customize',
      label: t('steps.customize', 'Customize'),
      completed: currentStep !== 'customize'
    },
    {
      id: 'preview',
      label: t('steps.preview', 'Preview'),
      completed: currentStep === 'order'
    },
    {
      id: 'order',
      label: t('steps.order', 'Order'),
      completed: false
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // If product is selected, show full screen designer
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Minimal header with home button and language switcher */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white"
          >
            <Home size={16} className="mr-2" />
            {t('common.home', 'Home')}
          </Button>
        </div>
        
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        <StampDesigner 
          product={selectedProduct} 
          onAddToCart={handleAddToCart} 
          onPreview={handlePreview} 
          currentStep={currentStep} 
        />
      </div>
    );
  }

  // Product selection screen with minimal layout
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="bg-white border-gray-200 hover:bg-gray-50"
        >
          <Home size={16} className="mr-2" />
          {t('common.home', 'Home')}
        </Button>
      </div>
      
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {t('designStamp.title', 'Design Your Professional Stamp')}
          </h1>
          <p className="text-gray-600">
            {t('designStamp.subtitle', 'Create a clean, professional stamp design with our easy-to-use designer.')}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-3 text-brand-blue">
            {t('designStamp.selectProduct', 'Select a Product')}
          </h2>
          <select 
            value={selectedProduct?.id || ''} 
            onChange={handleProductSelect}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue min-h-[44px]"
            aria-label={t('designStamp.selectProductAriaLabel', 'Select a stamp model')}
          >
            <option value="">{t('designStamp.selectProductPlaceholder', '-- Select a stamp model --')}</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.size} - {product.price} DHS
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-brand-red font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-brand-blue">
              {t('designStamp.step1Title', 'Select Your Stamp')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('designStamp.step1Description', 'Choose from our wide range of self-inking stamps in various sizes and styles.')}
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-brand-red font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-brand-blue">
              {t('designStamp.step2Title', 'Customize Your Design')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('designStamp.step2Description', 'Add your logo first, then customize text, adjust formatting, select ink color, and add borders.')}
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-brand-red font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-brand-blue">
              {t('designStamp.step3Title', 'Preview & Order')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('designStamp.step3Description', 'See an accurate preview of your stamp before adding to cart and completing your purchase.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStamp;
