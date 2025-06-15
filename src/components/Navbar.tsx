
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.products'), path: '/products' },
    { name: t('navigation.design'), path: '/design' },
    { name: t('navigation.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Trap focus in menu when open (accessibility)
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a,button,[tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isMenuOpen]);

  // Close menu when overlay is clicked/esc is pressed
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMenuOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto px-4 py-3">
        <nav className="flex justify-between items-center">
          {/* Logo - responsive size */}
          <Link to="/" className="flex items-center" aria-label={t('common.brand')}>
            <img
              src="/lovable-uploads/36d86151-4951-4ebe-a585-8d2d9aebb963.png"
              alt={t('common.brand')}
              className="h-12 md:h-16 w-auto"
              draggable="false"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-600 hover:text-brand-blue transition-colors px-2 py-1 rounded ${isActive(link.path) ? 'text-brand-blue font-medium' : ''}`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
            {/* Language Switcher */}
            <span className="ml-2"><LanguageSwitcher /></span>
            {/* Cart Icon */}
            <Link to="/cart" className="relative ml-3" aria-label={t('navigation.cart')}>
              <ShoppingCart className="h-7 w-7 text-gray-600 hover:text-brand-blue transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              className="relative mr-3"
              aria-label={t('navigation.cart')}
              tabIndex={0}
            >
              <ShoppingCart className="h-8 w-8 text-gray-600 hover:text-brand-blue" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none rounded p-2"
              aria-label={isMenuOpen ? t('navigation.closeMenu', 'Close menu') : t('navigation.openMenu', 'Open menu')}
              tabIndex={0}
            >
              {isMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile Overlay and Sliding Menu */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            ></div>
            {/* Sliding Menu */}
            <div
              ref={menuRef}
              className="fixed top-0 right-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-xl rounded-l-2xl flex flex-col
                        py-8 px-6 animate-slide-in-right transition-all duration-300
                        border-l border-gray-100"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 rounded p-2"
                aria-label={t('navigation.closeMenu', 'Close menu')}
                tabIndex={0}
              >
                <X className="h-7 w-7" />
              </button>
              <nav className="flex flex-col mt-8 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block w-full py-3 px-4 rounded-lg text-lg text-left transition
                                ${isActive(link.path)
                                  ? 'bg-gray-100 text-brand-blue font-bold'
                                  : 'text-gray-700 hover:bg-brand-blue/5'}`}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              {/* Language Switcher */}
              <div className="mt-8 px-2">
                <LanguageSwitcher />
              </div>
              <div className="flex-1" />
              {/* Optional: Additional mobile nav customizations */}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

