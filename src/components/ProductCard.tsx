import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { formatPrice, formatNumber } from '@/calc';
import { useCart } from '@/cart';
import { useToast } from '@/toast';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link to={`/product/${product.id}`} className="block p-5 flex-1">
        <h3 className="text-base font-semibold text-[#2d2d2d] mb-2 line-clamp-2">{product.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="text-gray-400">Тип:</span> {product.type}</p>
          <p><span className="text-gray-400">Марка стали:</span> {product.steelMark}</p>
          <p><span className="text-gray-400">Толщина:</span> {formatNumber(product.thickness)} мм</p>
          <p><span className="text-gray-400">Длина:</span> {formatNumber(product.length)} м</p>
        </div>
        <p className="mt-3 text-xl font-bold text-[#f97316]">{formatPrice(product.price)}<span className="text-sm font-normal text-gray-400">/т</span></p>
      </Link>
      <div className="p-5 pt-0">
        <button
          onClick={() => {
            addToCart(product.id, 1, 'tons');
            showToast('Товар добавлен в корзину');
          }}
          className="w-full bg-[#f97316] hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
