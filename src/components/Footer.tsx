import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getIsAdmin } from '@/storage';

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const update = () => setIsAdmin(getIsAdmin());
    update();
    window.addEventListener('storage', update);
    window.addEventListener('admin-change', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('admin-change', update);
    };
  }, []);

  return (
    <footer className="bg-[#2d2d2d] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-4">ЯРТЕП МЕТАЛЛ</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Продажа металлопроката в Ярославле. Широкий ассортимент, доступные цены, отгрузка по всей России.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">Контакты</h4>
            <a href="tel:+79108248146" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#f97316] transition-colors">
              <Phone className="w-4 h-4 text-[#f97316]" /> +7 (910) 824-81-46
            </a>
            <a href="mailto:yartep_group@mail.ru" className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#f97316] transition-colors">
              <Mail className="w-4 h-4 text-[#f97316]" /> yartep_group@mail.ru
            </a>
            <p className="flex items-start gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-[#f97316] mt-0.5 flex-shrink-0" /> г. Ярославль, ул. Старая Костромская, д. 3А
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-[#f97316]" /> График работы: с 8:00 до 18:00
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-[#f97316] transition-colors">Каталог</Link></li>
              <li><Link to="/contacts" className="text-gray-300 hover:text-[#f97316] transition-colors">Контакты</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-300 hover:text-[#f97316] transition-colors">Политика cookie</Link></li>
              {isAdmin && <li><Link to="/admin" className="text-[#f97316] hover:text-orange-400 transition-colors font-medium">Админ-панель</Link></li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Вся представленная на сайте информация, включая цены, характеристики товаров и наличие на складе, носит
            справочный характер и не является публичной офертой, определяемой положениями статьи 437(2) Гражданского
            кодекса Российской Федерации. Для уточнения актуальных цен и условий поставки обращайтесь к менеджерам
            компании. Все товарные знаки принадлежат их правообладателям.
          </p>
        </div>
      </div>
    </footer>
  );
}
