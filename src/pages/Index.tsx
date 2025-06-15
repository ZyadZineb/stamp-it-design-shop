
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Check, Truck, ThumbsUp, Award, Phone, Mail, MapPin } from 'lucide-react';
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

        {/* Features Section */}
        <section className="py-20 bg-white border-t border-gray-100" aria-labelledby="features-heading">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2
                id="features-heading"
                className="text-4xl font-bold tracking-tight text-gray-900 mb-4"
                style={{ letterSpacing: "-1px" }}
              >
                {t('features.whyChoose')}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
                {t('features.whyChooseDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in">
                <span className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10">
                  <Award className="text-brand-red" size={36} />
                </span>
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{t('features.premiumQuality')}</h3>
                <p className="text-gray-500 text-base">{t('features.premiumQualityDesc')}</p>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in">
                <span className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10">
                  <ThumbsUp className="text-brand-blue" size={36} />
                </span>
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{t('features.customizable')}</h3>
                <p className="text-gray-500 text-base">{t('features.customizableDesc')}</p>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in">
                <span className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10">
                  <Truck className="text-brand-red" size={36} />
                </span>
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{t('features.fastDelivery')}</h3>
                <p className="text-gray-500 text-base">{t('features.fastDeliveryDesc')}</p>
              </div>
              <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 animate-fade-in">
                <span className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10">
                  <Check className="text-brand-blue" size={36} />
                </span>
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{t('features.wideSelection')}</h3>
                <p className="text-gray-500 text-base">{t('features.wideSelectionDesc')}</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link to="/products" className="btn-secondary text-base px-6 py-3 rounded-lg shadow-sm hover:shadow-md font-semibold">
                {t('navbar.exploreCollection')}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-blue py-16 text-white" aria-labelledby="cta-heading">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 id="cta-heading" className="text-3xl font-bold mb-4">
                  {t('cta.readyToCreate')}
                </h2>
                <p className="mb-6 text-blue-50">
                  {t('cta.designerDesc')}
                </p>
                <Link
                  to="/design"
                  className="bg-white text-brand-blue px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block"
                >
                  {t('cta.startDesigning')}
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                  <div className="text-brand-blue mb-4">
                    <h3 className="font-bold text-xl">{t('contactBlock.title')}</h3>
                    <p className="text-gray-600">{t('contactBlock.help')}</p>
                  </div>
                  <div className="space-y-3 text-gray-800">
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <Phone className="text-brand-blue w-5 h-5" />
                      </span>
                      <span><a href="tel:+212699118028" className="hover:underline">{t('footer.phone')}</a></span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <Mail className="text-brand-blue w-5 h-5" />
                      </span>
                      <span><a href="mailto:zyad.sobhi@gmail.com" className="hover:underline">{t('footer.email')}</a></span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <MapPin className="text-brand-blue w-5 h-5" />
                      </span>
                      <span>{t('contactBlock.address')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

