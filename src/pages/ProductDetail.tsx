import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from '@/cart';
import { useToast } from '@/toast';
import { formatPrice, formatNumber, calcItemTotal } from '@/calc';
import { Unit } from '@/types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useCart();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('tons');

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Товар не найден.</p>
        <Link to="/" className="text-[#f97316] hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  const total = calcItemTotal(product, quantity, unit);

  const handleAdd = () => {
    if (quantity <= 0) {
      showToast('Количество должно быть больше нуля');
      return;
    }
    addToCart(product.id, quantity, unit);
    showToast('Товар добавлен в корзину');
    navigate('/cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#f97316] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Назад в каталог
      </Link>

      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-[#2d2d2d] mb-6">{product.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-8">
          <Row label="Тип" value={product.type} />
          <Row label="Марка стали" value={product.steelMark} />
          <Row label="Толщина" value={`${formatNumber(product.thickness)} мм`} />
          <Row label="Длина" value={`${formatNumber(product.length)} м`} />
          <Row label="Вес погонного метра" value={`${formatNumber(product.weightPerMeter)} кг/м`} />
          <Row label="Цена за тонну" value={formatPrice(product.price)} accent />
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-[#2d2d2d] mb-4">Расчёт стоимости</h3>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Единица измерения</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnit('tons')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    unit === 'tons' ? 'bg-[#2d2d2d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Тонны
                </button>
                <button
                  onClick={() => setUnit('meters')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    unit === 'meters' ? 'bg-[#2d2d2d] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Метры
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Количество ({unit === 'tons' ? 'т' : 'м'})
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(0, +(q - 1).toFixed(2)))}
                  className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={0}
                  step={unit === 'tons' ? 0.1 : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center focus:outline-none focus:border-[#f97316]"
                />
                <button
                  onClick={() => setQuantity((q) => +(q + (unit === 'tons' ? 0.1 : 1)).toFixed(2))}
                  className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Итог: {quantity} {unit === 'tons' ? 'т' : 'м'}
              {unit === 'meters' && ` (${formatNumber((quantity * product.weightPerMeter) / 1000)} т)`}
            </span>
            <span className="text-2xl font-bold text-[#f97316]">{formatPrice(total)}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={quantity <= 0}
            className="mt-4 w-full bg-[#f97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-colors"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className={accent ? 'text-[#f97316] font-semibold' : 'text-[#2d2d2d] font-medium'}>{value}</span>
    </div>
  );
}
