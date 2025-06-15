
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />

        {/* Features Section */}
        <section className="py-16 bg-white" aria-labelledby="features-heading">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl font-bold text-gray-800 mb-4">
                {t('features.whyChoose')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('features.whyChooseDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Award className="text-brand-red" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('features.premiumQuality')}</h3>
                <p className="text-gray-600">{t('features.premiumQualityDesc')}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <ThumbsUp className="text-brand-blue" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('features.customizable')}</h3>
                <p className="text-gray-600">{t('features.customizableDesc')}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Truck className="text-brand-red" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('features.fastDelivery')}</h3>
                <p className="text-gray-600">{t('features.fastDeliveryDesc')}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Check className="text-brand-blue" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t('features.wideSelection')}</h3>
                <p className="text-gray-600">{t('features.wideSelectionDesc')}</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/products" className="btn-secondary">
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
