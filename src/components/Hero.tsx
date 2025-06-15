import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroCarousel from './HeroCarousel';
const Hero = () => {
  const {
    t,
    i18n
  } = useTranslation();
  const heroContent = {
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    description: t('hero.description'),
    ctaProducts: t('hero.ctaProducts'),
    ctaDesign: t('hero.ctaDesign'),
    imagePath: i18n.language.startsWith('en') ? "/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png" : "/lovable-uploads/96fba4bf-cc54-4b59-8b27-7e5776d0b544.png"
  };
  return <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-16 md:pt-44 pb-10 md:pb-32 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-4 md:gap-16 items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2 leading-tight md:text-7xl md:mb-10 md:leading-tight lg:text-5xl">
              {heroContent.title}
            </h1>
            <h2 className="
              text-lg font-medium text-brand-blue mb-2
              md:text-4xl md:mb-10
              lg:text-5xl
            ">
              {heroContent.subtitle}
            </h2>
            <p className="
              text-base text-gray-600 mb-3 max-w-xl font-light
              md:text-2xl md:mb-16
              lg:text-2xl
            ">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-6">
              <Link to="/products" className="
                  btn-primary text-xs px-2 py-2 rounded-lg shadow hover:shadow-lg min-w-11 min-h-11
                  md:text-2xl md:px-10 md:py-4 md:rounded-xl md:min-w-[180px] md:min-h-[56px] md:font-semibold
                ">
                {heroContent.ctaProducts}
              </Link>
              <Link to="/design" className="
                  btn-secondary text-xs px-2 py-2 rounded-lg shadow hover:shadow-lg min-w-11 min-h-11
                  md:text-2xl md:px-10 md:py-4 md:rounded-xl md:min-w-[180px] md:min-h-[56px] md:font-semibold
                ">
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
    </section>;
};
export default Hero;