
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StampDesigner from '../components/StampDesigner';
import { getProductById, products } from '../data/products';
import { Product } from '../types';
import LanguageSwitcher from '../components/LanguageSwitcher';

const DesignStamp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
    } else {
      setSelectedProduct(null);
    }
  };
  
  const handleAddToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                {t('designStamp.title', 'Design Your Custom Stamp')}
              </h1>
              <p className="text-gray-600 max-w-3xl">
                {t('designStamp.subtitle', 'Create a custom stamp that perfectly suits your needs. Choose a product, customize your text, select ink color, and see a preview of your stamp before ordering.')}
              </p>
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3">{t('designStamp.selectProduct', 'Select a Product')}</h2>
            <select
              value={selectedProduct?.id || ''}
              onChange={handleProductSelect}
              className="w-full md:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
          
          <div className="bg-white rounded-lg shadow-md mb-8">
            <StampDesigner product={selectedProduct} onAddToCart={handleAddToCart} />
          </div>
          
          {!selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
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
                <h3 className="font-semibold text-lg mb-2">
                  {t('designStamp.step2Title', 'Customize Your Design')}
                </h3>
                <p className="text-gray-600">
                  {t('designStamp.step2Description', 'Add your text, adjust formatting, select ink color, and even add your logo or QR code.')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('designStamp.step3Title', 'Preview & Order')}
                </h3>
                <p className="text-gray-600">
                  {t('designStamp.step3Description', 'See a preview of your stamp before adding to cart and completing your purchase.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DesignStamp;
