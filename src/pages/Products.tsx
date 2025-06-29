import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Product } from '../types';
import { products as allProducts } from '../data/products';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import TranslatedText from '../components/common/TranslatedText';

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    shapes: [] as string[],
    sizes: [] as string[],
    inkColors: [] as string[],
    priceRange: [0, 500] as [number, number],
  });
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Extract unique values for filter options
  const brands = Array.from(new Set(allProducts.map(p => p.brand)));
  const shapes = Array.from(new Set(allProducts.map(p => p.shape)));
  const sizes = Array.from(new Set(allProducts.map(p => p.size)));
  const inkColors = Array.from(new Set(allProducts.flatMap(p => p.inkColors)));
  
  // Price range
  const minPrice = Math.min(...allProducts.map(p => p.price));
  const maxPrice = Math.max(...allProducts.map(p => p.price));

  // Handle filter changes
  const handleBrandChange = (brand: string) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleShapeChange = (shape: string) => {
    setFilters(prev => {
      const newShapes = prev.shapes.includes(shape)
        ? prev.shapes.filter(s => s !== shape)
        : [...prev.shapes, shape];
      return { ...prev, shapes: newShapes };
    });
  };

  const handleSizeChange = (size: string) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleInkColorChange = (color: string) => {
    setFilters(prev => {
      const newColors = prev.inkColors.includes(color)
        ? prev.inkColors.filter(c => c !== color)
        : [...prev.inkColors, color];
      return { ...prev, inkColors: newColors };
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      shapes: [],
      sizes: [],
      inkColors: [],
      priceRange: [minPrice, maxPrice],
    });
    setSort('');
  };

  // Apply filters and sort
  React.useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Apply brand filter
    if (filters.brands.length > 0) {
      filteredProducts = filteredProducts.filter(p => filters.brands.includes(p.brand));
    }
    
    // Apply shape filter
    if (filters.shapes.length > 0) {
      filteredProducts = filteredProducts.filter(p => filters.shapes.includes(p.shape));
    }
    
    // Apply size filter
    if (filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(p => filters.sizes.includes(p.size));
    }
    
    // Apply ink color filter
    if (filters.inkColors.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        p.inkColors.some(color => filters.inkColors.includes(color))
      );
    }
    
    // Apply price range filter
    filteredProducts = filteredProducts.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }
    
    setProducts(filteredProducts);
  }, [filters, sort]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            <TranslatedText i18nKey="products.title">Notre Collection de Tampons</TranslatedText>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Mobile filter toggle */}
            {isMobile && (
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={toggleFilters}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal size={18} />
                  {showFilters ? (
                    <TranslatedText i18nKey="products.hideFilters">Masquer les filtres</TranslatedText>
                  ) : (
                    <TranslatedText i18nKey="products.showFilters">Afficher les filtres</TranslatedText>
                  )}
                </Button>
              </div>
            )}
            
            {/* Filters sidebar */}
            <div className={`md:w-1/4 ${(isMobile && !showFilters) ? 'hidden' : 'block'}`}>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">
                    <TranslatedText i18nKey="products.filters.title">Filtres</TranslatedText>
                  </h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                    <TranslatedText i18nKey="products.filters.clear">Effacer les filtres</TranslatedText>
                  </Button>
                </div>
                
                {/* Brand filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    <TranslatedText i18nKey="products.filters.brand">Marque</TranslatedText>
                  </h3>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <Checkbox 
                          id={`brand-${brand}`} 
                          checked={filters.brands.includes(brand)}
                          onCheckedChange={() => handleBrandChange(brand)}
                        />
                        <Label htmlFor={`brand-${brand}`} className="ml-2 cursor-pointer">
                          <TranslatedText i18nKey={`brands.${brand}`}>{brand}</TranslatedText>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shape filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    <TranslatedText i18nKey="products.filters.shape">Forme</TranslatedText>
                  </h3>
                  <div className="space-y-2">
                    {shapes.map(shape => (
                      <div key={shape} className="flex items-center">
                        <Checkbox 
                          id={`shape-${shape}`} 
                          checked={filters.shapes.includes(shape)}
                          onCheckedChange={() => handleShapeChange(shape)}
                        />
                        <Label htmlFor={`shape-${shape}`} className="ml-2 cursor-pointer">
                          <TranslatedText i18nKey={`shapes.${shape}`}>{shape}</TranslatedText>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Size filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    <TranslatedText i18nKey="products.filters.size">Taille</TranslatedText>
                  </h3>
                  <div className="space-y-2">
                    {sizes.map(size => (
                      <div key={size} className="flex items-center">
                        <Checkbox 
                          id={`size-${size}`} 
                          checked={filters.sizes.includes(size)}
                          onCheckedChange={() => handleSizeChange(size)}
                        />
                        <Label htmlFor={`size-${size}`} className="ml-2 cursor-pointer">
                          <TranslatedText i18nKey={`sizes.${size}`}>{size}</TranslatedText>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Ink color filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    <TranslatedText i18nKey="products.filters.inkColor">Couleur d'encre</TranslatedText>
                  </h3>
                  <div className="space-y-2">
                    {inkColors.map(color => (
                      <div key={color} className="flex items-center">
                        <Checkbox 
                          id={`color-${color}`} 
                          checked={filters.inkColors.includes(color)}
                          onCheckedChange={() => handleInkColorChange(color)}
                        />
                        <Label htmlFor={`color-${color}`} className="ml-2 cursor-pointer">
                          <TranslatedText i18nKey={`colors.${color}`}>{color}</TranslatedText>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price range filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">
                    <TranslatedText i18nKey="products.filters.price">Plage de prix</TranslatedText>
                  </h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[minPrice, maxPrice]}
                      min={minPrice}
                      max={maxPrice}
                      step={10}
                      value={filters.priceRange}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{filters.priceRange[0]} DHS</span>
                      <span>{filters.priceRange[1]} DHS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="md:w-3/4">
              {/* Sort options */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  <TranslatedText i18nKey="products.showing">Affichage de</TranslatedText> {products.length} <TranslatedText i18nKey="products.items">articles</TranslatedText>
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort-select" className="text-sm mr-2">
                    <TranslatedText i18nKey="products.sort.sortBy">Trier par</TranslatedText>:
                  </label>
                  <select 
                    id="sort-select" 
                    value={sort}
                    onChange={handleSortChange}
                    className="text-sm border rounded-md p-1"
                  >
                    <option value="">
                      <TranslatedText i18nKey="products.sort.recommended">Recommandé</TranslatedText>
                    </option>
                    <option value="price-asc">
                      <TranslatedText i18nKey="products.sort.priceLowHigh">Prix: croissant</TranslatedText>
                    </option>
                    <option value="price-desc">
                      <TranslatedText i18nKey="products.sort.priceHighLow">Prix: décroissant</TranslatedText>
                    </option>
                    <option value="name">
                      <TranslatedText i18nKey="products.sort.name">Nom</TranslatedText>
                    </option>
                  </select>
                </div>
              </div>
              
              {/* Products list */}
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    <TranslatedText i18nKey="products.empty">Aucun produit correspondant à votre recherche.</TranslatedText>
                  </p>
                  <Button onClick={clearFilters}>
                    <TranslatedText i18nKey="products.clearFilters">Effacer les filtres</TranslatedText>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
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
