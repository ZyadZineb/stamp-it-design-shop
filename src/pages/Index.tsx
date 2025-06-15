
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
// Remove unused imports
// import { Link } from 'react-router-dom';
// import { Check, Truck, ThumbsUp, Award, Phone, Mail, MapPin } from 'lucide-react';
import { useMetaTags, generateOrganizationSchema } from '../utils/seo';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();

  // Apply SEO meta tags
  useMetaTags({
    title: t('seo.indexTitle', 'Custom Self-Inking Stamps for Business'), // fallback for robots
    description: t('seo.indexDesc', 'Design and order custom self-inking stamps for your business or personal use. Choose from a wide range of models with free delivery in Casablanca, Morocco.'),
    structuredData: generateOrganizationSchema(),
    ogUrl: 'https://cachets-maroc.com/'
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        {/* CTA section has been removed */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
