import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import TranslatedText from './common/TranslatedText';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white border border-gray-100 shadow rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full animate-fade-in">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-52 object-cover object-center bg-gray-100"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-brand-blue mb-1">
          <TranslatedText
            i18nKey={`productNames.${product.id}`}
            ns="products"
            children={product.name}
          />
        </h3>
        <p className="text-gray-500 text-base mb-5 flex-1">
          <TranslatedText
            i18nKey={`productDescriptions.${product.id}`}
            ns="products"
            children={product.description}
          />
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-700 font-semibold text-lg">{product.price} DHS</span>
          <Link
            to={`/products/${product.id}`}
            className="btn-primary text-sm px-4 py-2 rounded-md"
          >
            <TranslatedText i18nKey="products.detailsLabel" ns="products">
              Plus de détails
            </TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
