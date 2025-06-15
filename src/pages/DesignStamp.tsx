import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StampDesigner from '../components/StampDesigner';
import { getProductById, products } from '../data/products';
import { Product } from '../types';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from 'lucide-react';
const DesignStamp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
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
  const steps = [{
    id: 'customize',
    label: t('steps.customize', 'Customize'),
    completed: currentStep !== 'customize'
  }, {
    id: 'preview',
    label: t('steps.preview', 'Preview'),
    completed: currentStep === 'order'
  }, {
    id: 'order',
    label: t('steps.order', 'Order'),
    completed: false
  }];
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = (currentStepIndex + 1) / steps.length * 100;
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                {t('designStamp.title', 'Design Your Professional Stamp')}
              </h1>
              <p className="text-gray-600 max-w-3xl text-sm sm:text-base">
                {t('designStamp.subtitle', 'Create a clean, professional stamp design with our easy-to-use designer. Follow our step-by-step process for optimal results.')}
              </p>
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Progress Steps - Show when product is selected */}
          {selectedProduct && <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">
                  {t('steps.title', 'Design Progress')}
                </h3>
                {currentStep !== 'customize' && <Button onClick={handleBackToCustomize} variant="outline" size="sm" className="flex items-center gap-2 min-h-[44px] text-brand-blue border-brand-blue hover:bg-brand-blue hover:text-white">
                    <ArrowLeft size={16} />
                    {t('steps.backToCustomize', 'Back to Customize')}
                  </Button>}
              </div>
              
              <Progress value={progress} className="h-2 mb-3" />
              
              <div className="flex justify-between">
                {steps.map((step, index) => <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step.completed ? 'bg-green-500 text-white' : index === currentStepIndex ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {step.completed ? <Check size={16} /> : index + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${index === currentStepIndex ? 'text-brand-red' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>)}
              </div>
            </div>}
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4">
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="font-semibold mb-3 text-brand-blue">
                  {t('designStamp.selectProduct', 'Select a Product')}
                </h2>
                <select value={selectedProduct?.id || ''} onChange={handleProductSelect} className="w-full md:max-w-md px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue min-h-[44px]" aria-label={t('designStamp.selectProductAriaLabel', 'Select a stamp model')}>
                  <option value="">{t('designStamp.selectProductPlaceholder', '-- Select a stamp model --')}</option>
                  {products.map(product => <option key={product.id} value={product.id}>
                      {product.name} - {product.size} - {product.price} DHS
                    </option>)}
                </select>
              </div>
              
              <div className="bg-white rounded-lg shadow-md mb-8">
                {currentStep === 'order' && selectedProduct ? <div className="p-6">
                    <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                      <Check className="text-green-500" />
                      {t('order.confirmation', 'Order Confirmed!')}
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{t('order.summary', 'Design Summary')}</h3>
                      <p className="text-gray-600 mb-2">{selectedProduct.name} - {selectedProduct.size}</p>
                      <p className="text-brand-red font-bold">{selectedProduct.price} DHS TTC</p>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          {t('order.processing', 'Your stamp will be processed and shipped within 2-3 business days.')}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/cart')} className="mt-4 bg-brand-red hover:bg-red-700 text-white min-h-[44px]">
                      {t('order.viewCart', 'View Cart')}
                    </Button>
                  </div> : <StampDesigner product={selectedProduct} onAddToCart={handleAddToCart} onPreview={handlePreview} currentStep={currentStep} />}
              </div>
            </div>
            
            
          </div>
          
          {!selectedProduct && <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-brand-blue">
                  {t('designStamp.step1Title', 'Select Your Stamp')}
                </h3>
                <p className="text-gray-600">
                  {t('designStamp.step1Description', 'Choose from our wide range of self-inking stamps in various sizes and styles.')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-brand-blue">
                  {t('designStamp.step2Title', 'Customize Your Design')}
                </h3>
                <p className="text-gray-600">
                  {t('designStamp.step2Description', 'Add your logo first, then customize text, adjust formatting, select ink color, and add borders.')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-brand-blue">
                  {t('designStamp.step3Title', 'Preview & Order')}
                </h3>
                <p className="text-gray-600">
                  {t('designStamp.step3Description', 'See an accurate preview of your stamp before adding to cart and completing your purchase.')}
                </p>
              </div>
            </div>}
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default DesignStamp;