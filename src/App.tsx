import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { CartProvider } from '@/cart';
import { ToastProvider } from '@/toast';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Admin from '@/pages/Admin';
import Contacts from '@/pages/Contacts';
import CookiePolicy from '@/pages/CookiePolicy';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#f5f5f4]">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
