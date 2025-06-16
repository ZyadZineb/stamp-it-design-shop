
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroCarousel from './HeroCarousel';

const Hero = () => {
  const { t, i18n } = useTranslation();
  
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
    <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-16 md:pt-44 pb-10 md:pb-32 overflow-hidden">
      <div className="container-custom relative border-zinc-100">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight md:text-6xl md:mb-6 lg:text-5xl">
              {heroContent.title}
            </h1>
            <h2 className="text-xl font-medium text-brand-blue mb-4 md:text-3xl md:mb-6 lg:text-2xl">
              {heroContent.subtitle}
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto md:mx-0 font-light md:text-xl md:mb-8">
              {heroContent.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/products" 
                className="btn-primary text-base px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all duration-200 md:text-lg md:px-8 md:py-4 md:rounded-xl font-semibold"
              >
                {heroContent.ctaProducts}
              </Link>
              <Link 
                to="/design" 
                className="btn-secondary text-base px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all duration-200 md:text-lg md:px-8 md:py-4 md:rounded-xl font-semibold"
              >
                {heroContent.ctaDesign}
              </Link>
            </div>
          </div>
          
          {/* Carousel */}
          <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-[90vw] sm:max-w-lg md:max-w-2xl">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -top-40 -right-40 w-[220px] h-[220px] md:w-[800px] md:h-[800px] rounded-full bg-blue-100 opacity-50 blur-3xl z-0" />
    </section>
  );
};

export default Hero;
