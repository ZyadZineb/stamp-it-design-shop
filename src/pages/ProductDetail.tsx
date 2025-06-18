
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import WhatsAppCheckout from '../components/StampDesigner/WhatsAppCheckout';
import { Separator } from "@/components/ui/separator";

const infoTagClass =
  "inline-block rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-blue-200";
const infoTagRedClass =
  "inline-block rounded-full bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-red-200";
const infoTagGrayClass =
  "inline-block rounded-full bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-gray-300";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['products', 'translation']);
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleValidationError = (validationErrors: { [key: string]: string }) => {
    setErrors(validationErrors);
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-xl mb-6">{t("products.empty", "No product found.")}</p>
          <Link 
            to="/products" 
            className="btn-primary mt-4 min-h-[44px] inline-flex items-center justify-center px-6 py-3"
          >
            {t("products.title", "Our Products")}
          </Link>
        </div>
      </div>
    );
  }

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-blue/10 via-white to-brand-red/10">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-red-100 animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-3 text-red-600">{t("products.empty", "No product found matching your query.")}</h1>
            <Button 
              onClick={() => navigate("/products")}
              className="min-h-[44px]"
            >
              {t("products.title", "Back to Products")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const goToStampDesigner = () => {
    navigate(`/design?productId=${product.id}`);
  };

  const resolvedDescription = t(`productDescriptions.${product?.id}`, { ns: 'products', defaultValue: product?.description });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 bg-gradient-to-bl from-brand-blue/5 via-gray-50 to-brand-red/10 ">
        <div className="container-custom animate-fade-in">
          <div className="mb-4">
            <Link 
              to="/products" 
              className="text-brand-blue hover:underline text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
            >
              &larr; {t("products.title", "Back to Products")}
            </Link>
          </div>
          <div className="bg-white flex flex-col xl:flex-row gap-12 rounded-2xl shadow-xl p-8 border border-gray-100 transition-[box-shadow] duration-300 hover:shadow-2xl">
            {/* Left: Image + Highlights */}
            <div className="w-full xl:w-1/2 flex flex-col items-center xl:items-start">
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center mb-6 h-80">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-auto h-64 object-contain transition-transform duration-300 hover:scale-105"
                  style={{ maxWidth: "100%" }}
                />
                <div className="absolute left-0 top-0">
                  <span className={infoTagRedClass}>{t(`brands.${product.brand}`, product.brand)}</span>
                </div>
              </div>
              <h1 className="text-2xl xl:text-3xl font-extrabold text-brand-blue mb-2 text-center xl:text-left">
                {t(`productNames.${product.id}`, { ns: 'products', defaultValue: product.name })}
              </h1>
              <div className="flex items-center gap-2 mb-3 flex-wrap justify-center xl:justify-start">
                <span className="text-lg xl:text-xl font-bold text-green-600 bg-green-50 rounded-md px-4 py-1">{product.price} DHS</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 justify-center xl:justify-start">
                <span className={infoTagClass}>{product.model}</span>
                <span className={infoTagGrayClass}>{t("products.details.shape", "Shape")}: {t("shapes." + product.shape, product.shape)}</span>
                <span className={infoTagGrayClass}>{t("products.details.size", "Size")}: {product.size}</span>
                <span className={infoTagGrayClass}>{t("products.details.lines", "Lines")}: {product.lines}</span>
              </div>
            </div>
            
            {/* Right: Description & Actions */}
            <div className="w-full xl:w-1/2 flex flex-col justify-center">
              <h2 className="text-lg text-brand-blue font-semibold mb-1">{t("products.details.about", "About this product")}</h2>
              <p className="text-gray-700 mb-6 italic">
                {resolvedDescription}
              </p>
              
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-600">{t("products.details.inkColors", "Ink Colors")}:</span>
                {product.inkColors.map((color) => (
                  <span
                    key={color}
                    className="w-6 h-6 rounded-full inline-block border-2 border-gray-300 mr-1"
                    style={{
                      background:
                        color === "black"
                          ? "#222"
                          : color === "blue"
                          ? "#2563eb"
                          : color === "red"
                          ? "#e30613"
                          : color === "green"
                          ? "#22c55e"
                          : "#eee",
                    }}
                    title={t(`colors.${color}`, color)}
                  ></span>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mb-8">
                <Button
                  onClick={goToStampDesigner}
                  className="w-full sm:w-auto min-h-[44px] border-brand-blue text-white bg-brand-blue font-semibold hover:bg-brand-blue/90 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {t("design.productDetail", "Design and Personalize")}
                </Button>
              </div>

              <Separator className="my-6" />

              {/* WhatsApp Order Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageCircle className="mr-2 text-green-600" size={20} />
                  📩 Order via WhatsApp
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-fullName">
                      Full Name *
                    </label>
                    <input
                      id="product-fullName"
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                      className={`w-full min-h-[44px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      aria-describedby={errors.fullName ? "product-fullName-error" : undefined}
                    />
                    {errors.fullName && (
                      <p id="product-fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-phoneNumber">
                      Phone Number
                    </label>
                    <input
                      id="product-phoneNumber"
                      type="tel"
                      value={customerInfo.phoneNumber}
                      onChange={(e) => handleCustomerInfoChange('phoneNumber', e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-deliveryAddress">
                      Delivery Address
                    </label>
                    <textarea
                      id="product-deliveryAddress"
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => handleCustomerInfoChange('deliveryAddress', e.target.value)}
                      className="w-full min-h-[88px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Enter your delivery address"
                      rows={3}
                    />
                  </div>
                </div>

                <WhatsAppCheckout
                  product={product}
                  customerInfo={customerInfo}
                  previewImage={null}
                  onValidationError={handleValidationError}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
