import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t, i18n } = useTranslation();
  
  // Use translations for hero fields
  const heroContent = {
    title: t('hero.title', i18n.language.startsWith('fr') ? "Tampons Auto-Encreurs Professionnels" : "Professional Self-Inking Stamps"),
    subtitle: t('hero.subtitle', i18n.language.startsWith('fr') ? "Des tampons de qualité pour vos besoins professionnels" : "Quality stamps for your business needs"),
    description: t(
      'hero.description',
      i18n.language.startsWith('fr')
        ? "Concevez et commandez des tampons auto-encreurs personnalisés pour votre entreprise. Choisissez parmi différentes tailles, formes et couleurs."
        : "Design and order custom self-inking stamps for your business. Choose from various sizes, shapes, and colors."
    ),
    ctaProducts: t('hero.ctaProducts', i18n.language.startsWith('fr') ? "Parcourir la Collection" : "Browse Collection"),
    ctaDesign: t('hero.ctaDesign', i18n.language.startsWith('fr') ? "Concevoir Votre Tampon" : "Design Your Stamp"),
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
              alt={t('hero.imageAlt', 'Stamp showcase')} 
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
