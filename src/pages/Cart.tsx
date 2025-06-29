
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import WhatsAppCartCheckout from '../components/StampDesigner/WhatsAppCartCheckout';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleValidationError = (validationErrors: { [key: string]: string }) => {
    setErrors(validationErrors);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={64} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                You don't have any items in your cart yet. Browse our products and add some stamps to your cart.
              </p>
              <Link to="/products" className="btn-primary min-h-[44px] inline-flex items-center justify-center px-6 py-3">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-4">Product</th>
                          <th className="text-center p-4">Quantity</th>
                          <th className="text-right p-4">Price</th>
                          <th className="text-right p-4">Total</th>
                          <th className="text-right p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={`${item.productId}-${item.customText}`} className="border-b">
                            <td className="p-4">
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                  {item.previewImage ? (
                                    <img src={item.previewImage} alt="Custom Stamp Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-medium text-sm sm:text-base">{item.product.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    {item.product.size} • {item.inkColor} ink
                                  </p>
                                  {item.customText && (
                                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                                      Custom text: {item.customText}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="min-h-[44px] min-w-[44px] p-2 border rounded-l-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="min-w-[44px] min-h-[44px] flex items-center justify-center border-t border-b text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="min-h-[44px] min-w-[44px] p-2 border rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              {item.product.price} DHS
                            </td>
                            <td className="p-4 text-right font-medium">
                              {item.product.price * item.quantity} DHS
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="min-h-[44px] min-w-[44px] text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2"
                                aria-label="Remove item from cart"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <Link 
                    to="/products" 
                    className="text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
                  >
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div>
                {/* Use the enhanced WhatsApp checkout component */}
                <WhatsAppCartCheckout />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
