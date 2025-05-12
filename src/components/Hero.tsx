
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-red"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-brand-blue"></div>
      </div>
      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Custom <span className="text-brand-red">Self-Inking Stamps</span> for Your Business
            </h1>
            <p className="text-lg text-gray-600">
              Design and preview your stamps before ordering with our easy-to-use online tool. 
              Professional quality guaranteed with fast delivery across Morocco.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/design" className="btn-primary inline-flex items-center gap-2">
                Design Your Stamp <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
                Browse Catalog
              </Link>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mt-6 inline-flex items-center gap-3 text-gray-700">
              <div className="bg-brand-blue/10 p-2 rounded-full">
                <Phone className="text-brand-blue w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">WhatsApp / Phone</p>
                <p className="text-lg font-bold">06 99 11 80 28</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/lovable-uploads/a91604fd-99b9-4812-922f-91e34cf59242.png"
                  alt="Sirdas Stamp"
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/lovable-uploads/ae1b3e93-30d3-42e7-b6f3-02d21160d651.png"
                  alt="Shiny Stamp"
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="/lovable-uploads/c8a9d444-ab04-44f5-80dd-b196c3b48725.png"
                  alt="Wooden Stamp"
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="/lovable-uploads/ea0b1c21-c188-4d30-ab58-2b411be021c8.png"
                  alt="Trodat Stamp"
                  className="w-full h-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
