
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link 
            to={`/design?productId=${product.id}`} 
            className="bg-brand-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Eye size={20} />
          </Link>
          <button 
            onClick={() => addToCart(product, 1)}
            className="bg-brand-red text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
          <span className="text-sm text-gray-500">
            {product.size}
          </span>
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {product.lines} lines • {product.inkColors.join(", ")} ink
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-brand-red">
            {product.price} DHS TTC
          </span>
          <Link 
            to={`/design?productId=${product.id}`} 
            className="text-sm text-brand-blue font-medium hover:underline"
          >
            Customize →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
