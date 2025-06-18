
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useStampCart } from '@/contexts/StampCartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { t } = useTranslation();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    getItemCount,
    clearCart 
  } = useStampCart();

  if (cartItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              {t('cart.title', 'Your Stamp Cart')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">
              {t('cart.empty', 'Your cart is empty')}
            </p>
            <Button onClick={onClose} className="min-h-[44px]">
              {t('cart.continueShopping', 'Continue Designing')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart size={20} />
              {t('cart.title', 'Your Stamp Cart')} ({getItemCount()})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-800"
            >
              Clear All
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.previewImage ? (
                    <img 
                      src={item.previewImage} 
                      alt="Stamp Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain" 
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">
                    {item.product.name} ({item.product.size})
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {item.inkColor} ink • {item.shape}
                  </p>
                  
                  {item.customText.some(line => line.text.trim()) && (
                    <p className="text-xs text-gray-500 mb-2">
                      Text: {item.customText.filter(line => line.text.trim()).map(line => line.text).join(' | ')}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.product.price * item.quantity} DHS
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>{getTotalPrice()} DHS</span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 min-h-[44px]"
          >
            {t('cart.continueShopping', 'Continue Designing')}
          </Button>
          <Button
            onClick={onProceedToCheckout}
            className="flex-1 min-h-[44px] bg-green-600 hover:bg-green-700"
          >
            📩 {t('cart.proceedToCheckout', 'Proceed to WhatsApp Checkout')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
