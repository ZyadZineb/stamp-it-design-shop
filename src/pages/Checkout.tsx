
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cart page since we're using WhatsApp-only checkout
    navigate('/cart', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Cart...</h1>
        <p className="text-gray-600">We now use WhatsApp for all orders. Redirecting you to the cart page.</p>
      </div>
    </div>
  );
};

export default Checkout;
