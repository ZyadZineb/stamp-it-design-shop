
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Products from './pages/Products';
import Contact from './pages/Contact';
import DesignStamp from './pages/DesignStamp';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import { CartProvider } from './contexts/CartContext';
import '@/App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/design" element={<DesignStamp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </CartProvider>
  );
}

export default App;
