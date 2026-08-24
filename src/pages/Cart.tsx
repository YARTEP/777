import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/cart';
import { useToast } from '@/toast';
import { formatPrice, formatNumber, calcItemTotal } from '@/calc';
import { Order, OrderCustomer } from '@/types';
import { getOrders, saveOrders } from '@/storage';

export default function Cart() {
  const { cart, products, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  const [promo, setPromo] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState<OrderCustomer>({ fullName: '', phone: '', email: '', address: '', comment: '' });

  const cartProducts = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((c): c is { item: typeof cart[0]; product: NonNullable<typeof c.product> } => Boolean(c.product));

  const total = cartProducts.reduce((sum, { item, product }) => sum + calcItemTotal(product, item.quantity, item.unit), 0);

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !form.address) {
      showToast('Заполните обязательные поля');
      return;
    }
    const order: Order = {
      id: `ord-${Date.now()}`,
      items: cart,
      customer: form,
      total,
      createdAt: new Date().toISOString(),
    };
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);
    clearCart();
    setShowCheckout(false);
    setForm({ fullName: '', phone: '', email: '', address: '', comment: '' });
    showToast('Заказ оформлен! Мы свяжемся с вами.');
  };

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[#2d2d2d] mb-2">Корзина пуста</h1>
        <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
        <Link to="/" className="inline-block bg-[#f97316] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-[#2d2d2d] mb-6">Корзина</h1>

      <div className="space-y-3 mb-6">
        {cartProducts.map(({ item, product }) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <Link to={`/product/${product.id}`} className="font-medium text-[#2d2d2d] hover:text-[#f97316] transition-colors block">
                {product.name}
              </Link>
              <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4">
                <span>{product.type}</span>
                <span>{product.steelMark}</span>
                <span>{formatPrice(product.price)}/т</span>
                <span>вес {formatNumber(product.weightPerMeter)} кг/м</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(product.id, Math.max(0, +(item.quantity - (item.unit === 'tons' ? 0.1 : 1)).toFixed(2)))} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min={0}
                step={item.unit === 'tons' ? 0.1 : 1}
                value={item.quantity}
                onChange={(e) => updateQuantity(product.id, Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-[#f97316]"
              />
              <button onClick={() => updateQuantity(product.id, +(item.quantity + (item.unit === 'tons' ? 0.1 : 1)).toFixed(2))} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-400 w-8">{item.unit === 'tons' ? 'т' : 'м'}</span>
            </div>

            <div className="text-right w-28">
              <p className="font-semibold text-[#f97316]">{formatPrice(calcItemTotal(product, item.quantity, item.unit))}</p>
            </div>

            <button onClick={() => removeItem(product.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Промокод"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f97316]"
          />
          <button onClick={() => showToast('Промокод принят (скидка не предусмотрена)')} className="text-sm text-gray-500 hover:text-[#f97316] border border-gray-200 hover:border-[#f97316] rounded-lg px-4 py-2 transition-colors">
            Применить
          </button>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-base text-gray-600">Итого:</span>
          <span className="text-3xl font-bold text-[#f97316]">{formatPrice(total)}</span>
        </div>

        <button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-3.5 rounded-lg transition-colors"
        >
          Оформить заказ
        </button>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCheckout(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-[#2d2d2d]">Оформление заказа</h2>
              <button onClick={() => setShowCheckout(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitOrder} className="space-y-3">
              <Field label="ФИО *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Field label="Телефон *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
              <Field label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required type="email" />
              <Field label="Адрес *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Комментарий</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f97316]"
                />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Сумма заказа:</span>
                <span className="text-xl font-bold text-[#f97316]">{formatPrice(total)}</span>
              </div>
              <button type="submit" className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Подтвердить заказ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f97316]"
      />
    </div>
  );
}
