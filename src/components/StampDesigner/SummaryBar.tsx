
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { Button } from "@/components/ui/button";

interface SummaryBarProps {
  product: Product;
  inkColor: string;
  price: number | string;
  onAddToCart: () => void;
}

const SummaryBar: React.FC<SummaryBarProps> = ({ product, inkColor, price, onAddToCart }) => (
  <div className="flex-shrink-0 bg-gradient-to-r from-red-50 to-pink-50 border-t border-red-100 p-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm">Taille: {product.size} • Couleur: {inkColor}</p>
      </div>
      <div className="text-right mr-4">
        <span className="font-bold text-2xl text-red-600">{price} DHS</span>
        <p className="text-sm text-gray-600">TTC</p>
      </div>
      <Button
        onClick={onAddToCart}
        className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
      >
        <ShoppingCart size={20} />
        Ajouter au Panier
      </Button>
    </div>
  </div>
);

export default SummaryBar;
