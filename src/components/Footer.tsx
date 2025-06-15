import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.brand')}</h3>
            <p className="mb-4 text-gray-300">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.phone')}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.email')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.location')}</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link to="/design" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.design')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Free Shipping */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.freeDelivery')}</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.deliveryDescription')}
            </p>
            <div className="bg-white/10 p-4 rounded-md">
              <h4 className="font-medium mb-2">{t('footer.whyChooseUs')}</h4>
              <ul className="text-gray-300 list-disc pl-5 space-y-1">
                <li>{t('footer.highQualityStamps')}</li>
                <li>{t('footer.customDesign')}</li>
                <li>{t('footer.quickDelivery')}</li>
                <li>{t('footer.customerService')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.brand')}. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
