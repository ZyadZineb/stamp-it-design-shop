import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation(['contact', 'translation']);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.success'));
    setName('');
    setEmail('');
    setPhoneValue('');
    setMessage('');
  };

  const phoneDisplay = "+212 6 99 11 80 28";
  const emailDisplay = "zyad.sobhi@gmail.com";
  const addressDisplay = "Mohammedia, Maroc";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow py-4 md:py-8">
        <div className="container-custom">
          <div className="mb-6 md:mb-10 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 md:mb-3">{t('title', { ns: 'contact' })}</h1>
            <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">{t('description', { ns: 'contact' })}</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8 relative">
            {/* Left: Contact Info */}
            <div className="lg:w-1/2 flex flex-col items-center justify-center">
              <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-4 md:p-8 w-full max-w-md mx-auto mb-4 md:mb-8 lg:mb-0">
                <h2 className="text-lg md:text-xl font-semibold text-brand-blue mb-4 md:mb-6 text-center">{t('getInTouch', { ns: 'contact' })}</h2>
                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center shadow">
                      <Phone className="text-brand-red w-6 h-6" />
                    </span>
                    <div>
                      <div className="text-xs uppercase font-semibold text-gray-500 tracking-wide">{t('phoneLabel', { ns: 'contact' })}</div>
                      <a href="tel:+212699118028" className="text-lg font-medium text-gray-800 hover:text-brand-red transition">{phoneDisplay}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center shadow">
                      <Mail className="text-brand-blue w-6 h-6" />
                    </span>
                    <div>
                      <div className="text-xs uppercase font-semibold text-gray-500 tracking-wide">{t('emailLabel', { ns: 'contact' })}</div>
                      <a href="mailto:zyad.sobhi@gmail.com" className="text-lg font-medium text-gray-800 hover:text-brand-blue transition">{emailDisplay}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center shadow">
                      <MapPin className="text-brand-red w-6 h-6" />
                    </span>
                    <div>
                      <div className="text-xs uppercase font-semibold text-gray-500 tracking-wide">{t('addressLabel', { ns: 'contact' })}</div>
                      <span className="text-lg font-medium text-gray-800">{addressDisplay}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-2 md:mb-4 text-brand-blue">{t('hoursTitle', { ns: 'contact' })}</h3>
                  <table className="w-full text-xs md:text-[15px] table-fixed">
                    <tbody>
                      <tr className="flex flex-col md:table-row">
                        <td className="py-1 md:py-1">{t('weekdays', { ns: 'contact' })}</td>
                        <td className="py-1 md:py-1 text-right md:text-right">{t('weekdaysHours', { ns: 'contact' })}</td>
                      </tr>
                      <tr className="flex flex-col md:table-row">
                        <td className="py-1 md:py-1">{t('saturday', { ns: 'contact' })}</td>
                        <td className="py-1 md:py-1 text-right md:text-right">{t('saturdayHours', { ns: 'contact' })}</td>
                      </tr>
                      <tr className="flex flex-col md:table-row">
                        <td className="py-1 md:py-1">{t('sunday', { ns: 'contact' })}</td>
                        <td className="py-1 md:py-1 text-right md:text-right">{t('sundayHours', { ns: 'contact' })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Right: Contact Form */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-lg mx-auto">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-brand-blue text-center">{t('formTitle', { ns: 'contact' })}</h2>
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fullNameLabel', { ns: 'contact' })}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-slate-50"
                        required
                        placeholder={t('fullNamePlaceholder', { ns: 'contact' })}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('emailInputLabel', { ns: 'contact' })}
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-slate-50"
                        required
                        placeholder={t('emailInputPlaceholder', { ns: 'contact' })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('phoneInputLabel', { ns: 'contact' })}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-slate-50"
                      required
                      placeholder={t('phoneInputPlaceholder', { ns: 'contact' })}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('messageLabel', { ns: 'contact' })}
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/50 bg-slate-50"
                      required
                      placeholder={t('messagePlaceholder', { ns: 'contact' })}
                    />
                  </div>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto text-base font-semibold shadow hover:scale-[1.03] transition"
                    >
                      <Send size={18} />
                      {t('sendButton', { ns: 'contact' })}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Divider for desktop */}
            <div className="hidden lg:block h-full w-0.5 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent absolute left-1/2 top-0"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
