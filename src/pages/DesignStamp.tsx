
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnhancedStampDesigner from '../components/StampWizard/EnhancedStampDesigner';
import { getProductById, products } from '../data/products';
import { Product } from '../types';

const DesignStamp = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  
  const handleProductSelect = (id: string) => {
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
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Design Your Custom Stamp</h1>
            <p className="text-gray-600 max-w-3xl">
              Create a custom stamp that perfectly suits your needs. Choose a product, customize your text, 
              select ink color, and see a preview of your stamp before ordering.
            </p>
          </div>
          
          <div className="mb-8">
            <EnhancedStampDesigner 
              product={selectedProduct} 
              onAddToCart={handleAddToCart} 
              onProductSelect={handleProductSelect}
              products={products}
            />
          </div>
          
          {!selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Select Your Stamp</h3>
                <p className="text-gray-600">
                  Choose from our wide range of self-inking stamps in various sizes and styles.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Customize Your Design</h3>
                <p className="text-gray-600">
                  Add your text, adjust formatting, select ink color, and even add your logo.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-brand-red font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Preview & Order</h3>
                <p className="text-gray-600">
                  See a preview of your stamp before adding to cart and completing your purchase.
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
