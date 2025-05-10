
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/c8a9d444-ab04-44f5-80dd-b196c3b48725.png" 
                alt="Cachets Maroc Logo" 
                className="w-8 h-8 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <span className="text-xl font-bold text-brand-red">Cachets Maroc</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-red font-medium">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium">Products</Link>
            <Link to="/design" className="text-gray-700 hover:text-brand-red font-medium">Design Your Stamp</Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-red font-medium">Contact</Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="text-brand-blue w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="text-brand-blue w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-brand-red font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-brand-red font-medium" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/design" className="text-gray-700 hover:text-brand-red font-medium" onClick={() => setIsMenuOpen(false)}>Design Your Stamp</Link>
              <Link to="/contact" className="text-gray-700 hover:text-brand-red font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
