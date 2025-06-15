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
    <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-8 md:pt-24 pb-2 md:pb-16 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-center">
          <div>
            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2 md:mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <h2 className="text-base md:text-2xl font-medium text-brand-blue mb-2 md:mb-6">
              {heroContent.subtitle}
            </h2>
            <p className="text-sm md:text-xl text-gray-600 mb-3 md:mb-10 max-w-xl font-light">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-4">
              <Link to="/products" className="btn-primary text-xs md:text-base px-2 md:px-8 py-2 md:py-3 rounded-lg shadow hover:shadow-lg min-w-11 min-h-11">
                {heroContent.ctaProducts}
              </Link>
              <Link to="/design" className="btn-secondary text-xs md:text-base px-2 md:px-8 py-2 md:py-3 rounded-lg shadow hover:shadow-lg min-w-11 min-h-11">
                {heroContent.ctaDesign}
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full">
            <div className="w-full max-w-[97vw] sm:max-w-md md:max-w-2xl">
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
