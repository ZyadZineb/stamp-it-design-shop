
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-800 font-sans border-t border-gray-200 py-6 px-2 text-sm">
      <div className="container-custom flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Brand & Contact */}
        <div className="flex-1 flex flex-col gap-2 min-w-[160px]">
          <h3 className="font-extrabold text-brand-red text-lg mb-1 tracking-tight">{t('footer.brand')}</h3>
          <p className="mb-1 text-gray-600 leading-snug">{t('footer.description')}</p>
          <div className="space-y-1 mt-1">
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-brand-red" />
              <a href={`tel:${t('footer.phone')}`} className="hover:text-brand-red transition">{t('footer.phone')}</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-brand-blue" />
              <a href={`mailto:${t('footer.email')}`} className="hover:text-brand-blue transition">{t('footer.email')}</a>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-red" />
              <span>{t('footer.location')}</span>
            </div>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex-1 min-w-[120px]">
          <h3 className="font-semibold text-brand-blue mb-2 text-base">{t('footer.quickLinks')}</h3>
          <ul className="flex flex-col gap-1">
            <li>
              <Link to="/" className="hover:text-brand-red">{t('navigation.home')}</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-brand-red">{t('navigation.products')}</Link>
            </li>
            <li>
              <Link to="/design" className="hover:text-brand-red">{t('navigation.design')}</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-red">{t('navigation.contact')}</Link>
            </li>
          </ul>
        </div>
        {/* Why Us & Delivery */}
        <div className="flex-1 min-w-[140px] flex flex-col gap-2">
          <div>
            <h3 className="font-semibold text-brand-blue mb-0.5 text-base">{t('footer.freeDelivery')}</h3>
            <p className="text-gray-600 text-xs mb-1">{t('footer.deliveryDescription')}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-blue mb-0.5 text-xs">{t('footer.whyChooseUs')}</h4>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-xs">
              <li>{t('footer.highQualityStamps')}</li>
              <li>{t('footer.customDesign')}</li>
              <li>{t('footer.quickDelivery')}</li>
              <li>{t('footer.customerService')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500 border-t border-gray-200 pt-2">
        &copy; {new Date().getFullYear()} {t('footer.brand')}. {t('footer.allRightsReserved')}
      </div>
    </footer>
  );
};

export default Footer;
