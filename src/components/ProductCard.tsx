
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import TranslatedText from './common/TranslatedText';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white border border-gray-100 shadow rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full animate-fade-in p-3 md:p-5">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-36 md:h-52 object-contain object-center bg-gray-100 max-w-full"
        />
      </Link>
      <div className="pt-3 md:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[16px] md:text-lg text-brand-blue mb-1 truncate">
          <TranslatedText
            i18nKey={`productNames.${product.id}`}
            ns="products"
            children={product.name}
          />
        </h3>
        <p className="text-gray-500 text-sm md:text-base mb-3 md:mb-5 flex-1 line-clamp-3 md:line-clamp-6">
          <TranslatedText
            i18nKey={`productDescriptions.${product.id}`}
            ns="products"
            children={product.description}
          />
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-700 font-semibold text-base md:text-lg">{product.price} DHS</span>
          <Link
            to={`/products/${product.id}`}
            className="btn-primary text-xs md:text-sm px-2 md:px-4 py-2 md:py-2 rounded-md min-w-11 min-h-11"
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
