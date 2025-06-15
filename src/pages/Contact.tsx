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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('title', { ns: 'contact' })}</h1>
            <p className="text-gray-600 max-w-2xl">{t('description', { ns: 'contact' })}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-6">{t('getInTouch', { ns: 'contact' })}</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-brand-red w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('phoneLabel', { ns: 'contact' })}</p>
                      <p className="font-medium">{t('footer.phone')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-brand-blue w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('emailLabel', { ns: 'contact' })}</p>
                      <p className="font-medium">{t('footer.email')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-brand-red w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('addressLabel', { ns: 'contact' })}</p>
                      <p className="font-medium">{t('footer.location')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">{t('hoursTitle', { ns: 'contact' })}</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1">{t('weekdays', { ns: 'contact' })}</td>
                        <td className="py-1 text-right">{t('weekdaysHours', { ns: 'contact' })}</td>
                      </tr>
                      <tr>
                        <td className="py-1">{t('saturday', { ns: 'contact' })}</td>
                        <td className="py-1 text-right">{t('saturdayHours', { ns: 'contact' })}</td>
                      </tr>
                      <tr>
                        <td className="py-1">{t('sunday', { ns: 'contact' })}</td>
                        <td className="py-1 text-right">{t('sundayHours', { ns: 'contact' })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold mb-6">{t('formTitle', { ns: 'contact' })}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
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
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      required
                      placeholder={t('messagePlaceholder', { ns: 'contact' })}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <Send size={18} />
                      {t('sendButton', { ns: 'contact' })}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
