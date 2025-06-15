import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import LanguageSwitcher from './LanguageSwitcher';

// Utility to lock scroll on body when menu is open (mobile fix)
function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(isMenuOpen);

  const navLinks = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.products'), path: '/products' },
    { name: t('navigation.design'), path: '/design' },
    { name: t('navigation.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Trap focus in menu when open
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

  // Close menu on Esc
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
      <div className="container-custom mx-auto px-1 sm:px-2 py-1 md:py-3">
        <nav className="flex justify-between items-center min-h-[48px] md:min-h-[56px]">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center min-w-0"
            aria-label={t('common.brand')}
            tabIndex={0}
          >
            <img
              src="/lovable-uploads/36d86151-4951-4ebe-a585-8d2d9aebb963.png"
              alt={t('common.brand')}
              className="h-8 w-auto md:h-16 md:max-h-16 max-w-[100px] sm:max-w-[160px] object-contain"
              draggable="false"
              style={{ maxHeight: 48 }}
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-600 hover:text-brand-blue transition-colors px-1 py-0.5 rounded text-sm ${isActive(link.path) ? 'text-brand-blue font-medium' : ''}`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
            <span className="ml-1">
              <LanguageSwitcher />
            </span>
            <Link to="/cart" className="relative ml-2" aria-label={t('navigation.cart')}>
              <ShoppingCart className="h-7 w-7 text-gray-600 hover:text-brand-blue transition-colors min-h-11 min-w-11" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile: Cart + Hamburger menu */}
          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              className="relative mr-1 md:mr-2 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-11 min-h-11"
              aria-label={t('navigation.cart')}
              tabIndex={0}
            >
              <ShoppingCart className="h-9 w-9 text-gray-700 hover:text-brand-blue min-w-11 min-h-11" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 hover:text-brand-blue focus:outline-none p-2 rounded-full active:bg-gray-100 transition min-w-11 min-h-11"
              aria-label={t('navigation.openMenu', 'Open menu')}
              tabIndex={0}
              style={{ fontSize: 0 }}
            >
              <Menu className="h-10 w-10" />
            </button>
          </div>
        </nav>

        {/* Mobile Overlay and Full-Screen Sliding Menu */}
        {isMenuOpen && (
          <>
            {/* Fullscreen overlay */}
            <div
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            ></div>
            {/* Fullscreen drawer */}
            <div
              ref={menuRef}
              className="fixed inset-0 z-[110] bg-white py-5 px-6 flex flex-col rounded-t-3xl rounded-b-none shadow-2xl animate-slide-in-up transition-all duration-300
                border-t border-gray-100"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-5 right-6 text-gray-600 hover:text-brand-blue rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                aria-label={t('navigation.closeMenu', 'Close menu')}
                tabIndex={0}
              >
                <X className="h-9 w-9" />
              </button>
              <nav className="flex flex-col mt-16 gap-4 w-full" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      block w-full py-4 px-4 rounded-xl text-xl font-semibold text-left transition-all
                      ${isActive(link.path)
                        ? 'bg-gray-100 text-brand-blue font-bold'
                        : 'text-gray-800 hover:bg-brand-blue/10'}
                    `}
                    style={{
                      minHeight: 56,
                      letterSpacing: '-0.5px'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-10 px-1">
                <LanguageSwitcher />
              </div>
              <div className="flex-1" />
              <div className="text-center py-4 text-xs text-gray-400">
                &copy; 2025 Cachets Maroc
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
