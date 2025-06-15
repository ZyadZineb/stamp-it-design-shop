
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getFeaturedProducts } from '../data/products';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-14">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">
              Featured Products
            </h2>
            <p className="text-gray-500 text-lg font-light">
              Discover our most popular self-inking stamps
            </p>
          </div>
          <Link
            to="/products"
            className="mt-6 md:mt-0 btn-secondary text-base px-6 py-3 rounded-lg shadow font-semibold"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
