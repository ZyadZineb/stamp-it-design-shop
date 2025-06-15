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
            <h3 className="text-xl font-semibold mb-4">{t('footer.brand', 'Cachets Maroc')}</h3>
            <p className="mb-4 text-gray-300">
              {t('footer.description', 'Your trusted partner for high-quality self-inking stamps in Morocco. We offer a wide range of stamps for business and personal use.')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.phone', '06 99 11 80 28')}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.email', 'zyad.sobhi@gmail.com')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-red" />
              <span className="text-gray-300">{t('footer.location', 'Casablanca, Morocco')}</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t('footer.quickLinks', 'Quick Links')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.home', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.products', 'Products')}
                </Link>
              </li>
              <li>
                <Link to="/design" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.design', 'Design a Stamp')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.contact', 'Contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Free Shipping */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.freeDelivery', 'Free Delivery')}</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.deliveryDescription', 'We offer free delivery for all orders in Casablanca and surrounding regions.')}
            </p>
            <div className="bg-white/10 p-4 rounded-md">
              <h4 className="font-medium mb-2">{t('footer.whyChooseUs', 'Why Choose Us?')}</h4>
              <ul className="text-gray-300 list-disc pl-5 space-y-1">
                <li>{t('footer.highQualityStamps', 'High-quality self-inking stamps')}</li>
                <li>{t('footer.customDesign', 'Custom design options')}</li>
                <li>{t('footer.quickDelivery', 'Quick delivery')}</li>
                <li>{t('footer.customerService', 'Excellent customer service')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('footer.brand', 'Cachets Maroc')}. {t('footer.allRightsReserved', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
