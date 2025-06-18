
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, StampTextLine } from '@/types';
import { toast } from "@/hooks/use-toast";

export interface CartStampItem {
  id: string;
  product: Product;
  customText: StampTextLine[];
  inkColor: string;
  logoImage: string | null;
  logoPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  includeLogo: boolean;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  borderThickness: number;
  shape: 'rectangle' | 'circle' | 'oval';
  previewImage: string | null;
  quantity: number;
  createdAt: Date;
}

export interface CustomerInfo {
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
}

interface StampCartContextType {
  cartItems: CartStampItem[];
  customerInfo: CustomerInfo;
  addStampToCart: (item: Omit<CartStampItem, 'id' | 'createdAt'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  generateWhatsAppMessage: () => string;
}

const StampCartContext = createContext<StampCartContextType | undefined>(undefined);

export const StampCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartStampItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });

  const addStampToCart = (item: Omit<CartStampItem, 'id' | 'createdAt'>) => {
    const newItem: CartStampItem = {
      ...item,
      id: `stamp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    setCartItems(prev => [...prev, newItem]);
    toast({
      title: "✅ Added to Cart",
      description: `${item.product.name} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "🗑️ Removed from Cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    toast({
      title: "📝 Quantity Updated",
      description: "Cart quantity has been updated",
    });
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomerInfo({
      fullName: '',
      phoneNumber: '',
      deliveryAddress: ''
    });
    toast({
      title: "🧹 Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const generateWhatsAppMessage = () => {
    const orderDetails = [
      '🛠️ New Custom Stamp Order',
      '',
      `👤 Name: ${customerInfo.fullName}`,
    ];

    if (customerInfo.phoneNumber) {
      orderDetails.push(`📞 Phone: ${customerInfo.phoneNumber}`);
    }

    if (customerInfo.deliveryAddress) {
      orderDetails.push(`📍 Address: ${customerInfo.deliveryAddress}`);
    }

    orderDetails.push('');
    orderDetails.push('🧾 Stamps Ordered:');

    cartItems.forEach((item, index) => {
      orderDetails.push(`${index + 1}. Model: ${item.product.name} (${item.product.size})`);
      orderDetails.push(`   Quantity: ${item.quantity}`);
      orderDetails.push(`   Price: ${item.product.price} DHS each`);
      orderDetails.push(`   Ink Color: ${item.inkColor}`);
      
      const textLines = item.customText.filter(line => line.text.trim()).map(line => line.text);
      if (textLines.length > 0) {
        orderDetails.push(`   Text: "${textLines.join(' | ')}"`);
      }
      
      if (item.includeLogo) {
        orderDetails.push(`   Logo: Included (${item.logoPosition})`);
      }
      
      if (item.borderStyle !== 'none') {
        orderDetails.push(`   Border: ${item.borderStyle} (${item.borderThickness}px)`);
      }
      
      orderDetails.push('');
    });

    orderDetails.push(`💰 Total: ${getTotalPrice()} DHS`);
    orderDetails.push('');
    orderDetails.push('🎨 Design Previews: I will send the design images in the next message');
    orderDetails.push('');
    orderDetails.push('Please confirm this order and let me know the delivery timeline. Thank you!');

    return orderDetails.join('\n');
  };

  return (
    <StampCartContext.Provider
      value={{
        cartItems,
        customerInfo,
        addStampToCart,
        removeFromCart,
        updateQuantity,
        updateCustomerInfo,
        clearCart,
        getTotalPrice,
        getItemCount,
        generateWhatsAppMessage,
      }}
    >
      {children}
    </StampCartContext.Provider>
  );
};

export const useStampCart = () => {
  const context = useContext(StampCartContext);
  if (context === undefined) {
    throw new Error('useStampCart must be used within a StampCartProvider');
  }
  return context;
};
