import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t, i18n } = useTranslation();
  
  // Use translations for hero fields
  const heroContent = {
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    description: t('hero.description'),
    ctaProducts: t('hero.ctaProducts'),
    ctaDesign: t('hero.ctaDesign'),
    imagePath: i18n.language.startsWith('en')
      ? "/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png"
      : "/lovable-uploads/96fba4bf-cc54-4b59-8b27-7e5776d0b544.png"
  };
  
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
      <div className="container-custom mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {heroContent.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-brand-blue mb-4">
              {heroContent.subtitle}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="btn-primary"
              >
                {heroContent.ctaProducts}
              </Link>
              <Link 
                to="/design" 
                className="btn-secondary"
              >
                {heroContent.ctaDesign}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <img 
              src={heroContent.imagePath} 
              alt={t('hero.imageAlt')} 
              className="max-w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              width="500"
              height="350"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
