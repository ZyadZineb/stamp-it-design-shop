
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white relative overflow-hidden pb-0 pt-12">
      <div className="container-custom">
        <div className="w-full flex flex-col md:flex-row md:items-stretch gap-8">

          {/* Info Card */}
          <div className="flex-1 flex flex-col gap-5 bg-white/5 rounded-2xl p-7 md:p-8 shadow-xl relative z-10">
            <h3 className="text-2xl font-bold mb-1 text-brand-red tracking-tight">{t('footer.brand')}</h3>
            <p className="mb-1 text-gray-300 leading-relaxed">{t('footer.description')}</p>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-brand-red" />
                <a href={`tel:${t('footer.phone')}`} className="text-gray-200 hover:text-brand-red transition">{t('footer.phone')}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-brand-blue" />
                <a href={`mailto:${t('footer.email')}`} className="text-gray-200 hover:text-brand-blue transition">{t('footer.email')}</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-brand-red" />
                <span className="text-gray-200">{t('footer.location')}</span>
              </div>
            </div>
          </div>

          {/* Divider for desktop */}
          <div className="hidden md:flex min-h-full items-center px-4">
            <div className="w-px h-40 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Quick Links & Why Choose Us */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Quick Links */}
            <div className="bg-white/5 rounded-2xl p-7 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-brand-blue">{t('footer.quickLinks')}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/" className="text-gray-300 story-link">{t('navigation.home')}</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 story-link">{t('navigation.products')}</Link>
                </li>
                <li>
                  <Link to="/design" className="text-gray-300 story-link">{t('navigation.design')}</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 story-link">{t('navigation.contact')}</Link>
                </li>
              </ul>
            </div>
            {/* Shipping & Why Choose Us */}
            <div className="bg-brand-blue/10 rounded-2xl p-6 md:mt-2 flex flex-col gap-3 shadow-md">
              <h3 className="text-lg font-bold text-brand-blue mb-2">{t('footer.freeDelivery')}</h3>
              <p className="text-gray-300 mb-2">{t('footer.deliveryDescription')}</p>
              <div className="bg-white/10 rounded-md px-4 py-3">
                <h4 className="font-semibold text-gray-200 mb-1">{t('footer.whyChooseUs')}</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-1 text-base">
                  <li>{t('footer.highQualityStamps')}</li>
                  <li>{t('footer.customDesign')}</li>
                  <li>{t('footer.quickDelivery')}</li>
                  <li>{t('footer.customerService')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Footer bottom */}
        <div className="mt-10 py-6 border-t border-gray-700 text-center text-sm text-gray-400 relative z-10">
          <p>
            &copy; {new Date().getFullYear()} {t('footer.brand')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
      {/* Decorative blurred background accent */}
      <div className="absolute z-0 blur-2xl opacity-20 top-[40%] -left-24 w-96 h-40 bg-gradient-to-tr from-brand-red to-brand-blue rounded-full pointer-events-none"></div>
      <div className="absolute z-0 blur-3xl opacity-20 bottom-0 right-0 w-96 h-40 bg-brand-blue rounded-full pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
