
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-800 font-sans border-t border-gray-200 py-2 px-1 text-[11px] md:py-6 md:px-4 md:text-sm">
      <div className="container-custom flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6">
        {/* Brand & Contact */}
        <div className="flex-1 flex flex-col gap-0.5 min-w-[120px]">
          <h3 className="font-extrabold text-brand-red text-sm md:text-lg mb-0.5 tracking-tight">{t('footer.brand')}</h3>
          <p className="mb-1 text-gray-600 leading-snug">{t('footer.description')}</p>
          <div className="space-y-0.5 mt-1">
            <div className="flex items-center gap-1.5 min-h-11">
              <Phone size={16} className="text-brand-red min-w-11 min-h-11" />
              <a href={`tel:${t('footer.phone')}`} className="hover:text-brand-red transition pl-2">{t('footer.phone')}</a>
            </div>
            <div className="flex items-center gap-1.5 min-h-11">
              <Mail size={16} className="text-brand-blue min-w-11 min-h-11" />
              <a href={`mailto:${t('footer.email')}`} className="hover:text-brand-blue transition pl-2">{t('footer.email')}</a>
            </div>
            <div className="flex items-center gap-1.5 min-h-11">
              <MapPin size={16} className="text-brand-red min-w-11 min-h-11" />
              <span className="pl-2">{t('footer.location')}</span>
            </div>
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex-1 min-w-[90px]">
          <h3 className="font-semibold text-brand-blue mb-0 text-sm md:text-base">{t('footer.quickLinks')}</h3>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link to="/" className="hover:text-brand-red py-1 block">{t('navigation.home')}</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-brand-red py-1 block">{t('navigation.products')}</Link>
            </li>
            <li>
              <Link to="/design" className="hover:text-brand-red py-1 block">{t('navigation.design')}</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-red py-1 block">{t('navigation.contact')}</Link>
            </li>
          </ul>
        </div>
        {/* Why Us & Delivery */}
        <div className="flex-1 min-w-[100px] flex flex-col gap-0.5">
          <div>
            <h3 className="font-semibold text-brand-blue mb-0 text-xs md:text-base">{t('footer.freeDelivery')}</h3>
            <p className="text-gray-600 text-xs mb-1">{t('footer.deliveryDescription')}</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-blue mb-0 text-xs">{t('footer.whyChooseUs')}</h4>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-xs">
              <li>{t('footer.highQualityStamps')}</li>
              <li>{t('footer.customDesign')}</li>
              <li>{t('footer.quickDelivery')}</li>
              <li>{t('footer.customerService')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-1.5 md:mt-4 text-center text-[10px] md:text-xs text-gray-500 border-t border-gray-200 pt-1 md:pt-2">
        &copy; {new Date().getFullYear()} {t('footer.brand')}. {t('footer.allRightsReserved')}
      </div>
    </footer>
  );
};

export default Footer;
