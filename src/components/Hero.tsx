
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    <section className="relative bg-gradient-to-r from-white via-blue-50 to-blue-100 pt-24 pb-16 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              {heroContent.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium text-brand-blue mb-6">
              {heroContent.subtitle}
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-xl font-light">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-3 rounded-lg shadow hover:shadow-lg">
                {heroContent.ctaProducts}
              </Link>
              <Link to="/design" className="btn-secondary text-base px-8 py-3 rounded-lg shadow hover:shadow-lg">
                {heroContent.ctaDesign}
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={heroContent.imagePath}
              alt={t('hero.imageAlt')}
              className="max-w-[430px] w-full rounded-xl shadow-lg border-4 border-white animate-fade-in"
              style={{ background: "#fff" }}
              width="430"
              height="320"
            />
          </div>
        </div>
      </div>
      {/* Minimalist Large Blue Shape */}
      <div className="absolute -top-64 -right-72 w-[800px] h-[800px] rounded-full bg-blue-100 opacity-50 blur-3xl z-0" />
    </section>
  );
};

export default Hero;
