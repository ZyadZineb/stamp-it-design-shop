
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Products = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const brands = Array.from(new Set(products.map(product => product.brand)));
  
  const types = [
    { id: 'selfInking', name: 'Self-Inking Stamps' },
    { id: 'wooden', name: 'Wooden Stamps' },
    { id: 'round', name: 'Round Stamps' },
    { id: 'rectangular', name: 'Rectangular Stamps' },
  ];
  
  const filteredProducts = products.filter(product => {
    // Filter by brand
    if (selectedBrand && product.brand !== selectedBrand) return false;
    
    // Filter by type
    if (selectedType) {
      if (selectedType === 'wooden' && !product.name.toLowerCase().includes('wood')) return false;
      if (selectedType === 'round' && !product.size.toLowerCase().includes('mm')) return false;
      if (selectedType === 'rectangular' && !product.size.toLowerCase().includes('x')) return false;
      if (selectedType === 'selfInking' && product.name.toLowerCase().includes('wood')) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="lg:w-1/4">
              <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
                <h2 className="font-semibold text-lg mb-4 border-b pb-2">Filters</h2>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Brands</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all-brands"
                        name="brand"
                        checked={selectedBrand === null}
                        onChange={() => setSelectedBrand(null)}
                        className="mr-2"
                      />
                      <label htmlFor="all-brands" className="text-sm">All Brands</label>
                    </div>
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          checked={selectedBrand === brand}
                          onChange={() => setSelectedBrand(brand)}
                          className="mr-2"
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Type</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all-types"
                        name="type"
                        checked={selectedType === null}
                        onChange={() => setSelectedType(null)}
                        className="mr-2"
                      />
                      <label htmlFor="all-types" className="text-sm">All Types</label>
                    </div>
                    {types.map(type => (
                      <div key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`type-${type.id}`}
                          name="type"
                          checked={selectedType === type.id}
                          onChange={() => setSelectedType(type.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`type-${type.id}`} className="text-sm">{type.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedBrand(null);
                    setSelectedType(null);
                  }}
                  className="mt-6 text-sm text-brand-blue hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
            
            {/* Main content with products */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Stamp Collection</h1>
                <p className="text-gray-600">
                  Browse our extensive collection of high-quality stamps.
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">{filteredProducts.length} products found</p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setSelectedType(null);
                    }}
                    className="mt-4 text-brand-blue hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
