import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Phone, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/cart';

export default function Header() {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-[#f97316] ${
        location.pathname === to ? 'text-[#f97316]' : 'text-white'
      }`}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-[#2d2d2d] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-[#f97316] tracking-tight">ЯРТЕП МЕТАЛЛ</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-white">
            <a href="tel:+79108248146" className="flex items-center gap-2 hover:text-[#f97316] transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+7 (910) 824-81-46</span>
            </a>
            <a href="mailto:yartep_group@mail.ru" className="flex items-center gap-2 hover:text-[#f97316] transition-colors">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">yartep_group@mail.ru</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6">
              {navLink('/', 'Каталог')}
              {navLink('/contacts', 'Контакты')}
            </nav>
            <Link
              to="/cart"
              className="relative p-2 text-white hover:text-[#f97316] transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen((o) => !o)}
              aria-label="Меню"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            {navLink('/', 'Каталог')}
            {navLink('/contacts', 'Контакты')}
            <a href="tel:+79108248146" className="flex items-center gap-2 text-white text-sm">
              <Phone className="w-4 h-4 text-[#f97316]" /> +7 (910) 824-81-46
            </a>
            <a href="mailto:yartep_group@mail.ru" className="flex items-center gap-2 text-white text-sm">
              <Mail className="w-4 h-4 text-[#f97316]" /> yartep_group@mail.ru
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
