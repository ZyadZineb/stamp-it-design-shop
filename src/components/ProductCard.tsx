
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import TranslatedText from './common/TranslatedText';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-bold text-lg text-brand-blue mb-2">
          <TranslatedText
            i18nKey={`productNames.${product.id}`}
            children={product.name}
          />
        </h3>
        <p className="text-gray-700 mb-4">
          <TranslatedText
            i18nKey={`productDescriptions.${product.id}`}
            children={product.description}
          />
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">{product.price} DHS</span>
          <Link to={`/products/${product.id}`} className="btn-primary">
            <TranslatedText i18nKey="products.detailsLabel">
              Plus de détails
            </TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

