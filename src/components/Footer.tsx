
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 text-gray-800 font-sans border-t border-gray-200 pt-8 pb-2 relative overflow-hidden">
      <div className="container-custom">
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Info Card */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <h3 className="text-lg font-extrabold mb-1 text-brand-red tracking-tight">{t('footer.brand')}</h3>
            <p className="mb-2 text-gray-600 leading-snug text-sm">{t('footer.description')}</p>
            <div className="space-y-1 mt-1 text-sm">
              <div className="flex items-center gap-1.5">
                <Phone size={15} className="text-brand-red" />
                <a href={`tel:${t('footer.phone')}`} className="text-gray-700 hover:text-brand-red transition">{t('footer.phone')}</a>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={15} className="text-brand-blue" />
                <a href={`mailto:${t('footer.email')}`} className="text-gray-700 hover:text-brand-blue transition">{t('footer.email')}</a>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-brand-red" />
                <span className="text-gray-700">{t('footer.location')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mt-6 md:mt-0">
            <h3 className="text-md font-semibold mb-2 text-brand-blue">{t('footer.quickLinks')}</h3>
            <ul className="flex flex-col gap-1.5 text-sm">
              <li>
                <Link to="/" className="text-gray-700 hover:text-brand-red">{t('navigation.home')}</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-700 hover:text-brand-red">{t('navigation.products')}</Link>
              </li>
              <li>
                <Link to="/design" className="text-gray-700 hover:text-brand-red">{t('navigation.design')}</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-brand-red">{t('navigation.contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Why Choose Us & Shipping */}
          <div className="w-full md:w-2/5 mt-6 md:mt-0 flex flex-col gap-2">
            <div>
              <h3 className="text-md font-semibold mb-2 text-brand-blue">{t('footer.freeDelivery')}</h3>
              <p className="text-gray-600 text-sm mb-1">{t('footer.deliveryDescription')}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-blue mb-1">{t('footer.whyChooseUs')}</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-0.5 pl-2">
                <li>{t('footer.highQualityStamps')}</li>
                <li>{t('footer.customDesign')}</li>
                <li>{t('footer.quickDelivery')}</li>
                <li>{t('footer.customerService')}</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Footer bottom */}
        <div className="mt-6 py-3 border-t border-gray-100 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {t('footer.brand')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
      {/* Subtle accent background blurs */}
      <div className="absolute z-0 blur-2xl opacity-10 top-4 left-0 w-72 h-16 bg-brand-red rounded-full pointer-events-none"></div>
      <div className="absolute z-0 blur-2xl opacity-10 bottom-0 right-0 w-72 h-16 bg-brand-blue rounded-full pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
