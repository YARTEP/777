import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { getCookieConsent, setCookieConsent } from '@/storage';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(() => getCookieConsent());

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#2d2d2d] text-white shadow-2xl border-t border-[#f97316]/30 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
        <Cookie className="w-6 h-6 text-[#f97316] flex-shrink-0" />
        <p className="text-sm text-gray-200 flex-1 text-center sm:text-left">
          Мы используем файлы cookie для работы корзины и запоминания ваших предпочтений.{' '}
          <Link to="/cookie-policy" className="text-[#f97316] underline hover:text-orange-400">
            Политика cookie
          </Link>
        </p>
        <button
          onClick={() => {
            setCookieConsent(true);
            setAccepted(true);
          }}
          className="bg-[#f97316] hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
