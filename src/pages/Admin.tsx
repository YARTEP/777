import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Product, ProductType, SteelMark, Unit } from '../types';
import { formatPrice } from '../calc';
import { Lock, LogOut, Plus, Pencil, Trash2, X } from 'lucide-react';

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  type: 'лист',
  steelMark: 'Ст3',
  thickness: 1,
  length: 6,
  price: 50000,
  weightPerMeter: 1,
};

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [error, setError] = useState('');

  const loadData = async () => {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*');
    if (productsError) console.error(productsError);
    else setProducts(productsData || []);

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (ordersError) console.error(ordersError);
    else setOrders(ordersData || []);
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_session');
    if (saved === 'true') {
      setIsAdmin(true);
      loadData();
    }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      setPassword('');
      setError('');
      await loadData();
    } else {
      setError('Неверный пароль');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
    setTab('products');
  };

  const startAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowForm(true);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      type: p.type,
      steelMark: p.steelMark,
      thickness: p.thickness,
      length: p.length,
      price: p.price,
      weightPerMeter: p.weightPerMeter,
    });
    setShowForm(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.thickness <= 0 || form.length <= 0 || form.price <= 0 || form.weightPerMeter <= 0) {
      alert('Заполните все поля корректно');
      return;
    }

    if (editing) {
      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          type: form.type,
          steelMark: form.steelMark,
          thickness: form.thickness,
          length: form.length,
          price: form.price,
          weightPerMeter: form.weightPerMeter,
        })
        .eq('id', editing.id);
      if (error) {
        alert('Ошибка обновления: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: form.name,
          type: form.type,
          steelMark: form.steelMark,
          thickness: form.thickness,
          length: form.length,
          price: form.price,
          weightPerMeter: form.weightPerMeter,
        }]);
      if (error) {
        alert('Ошибка добавления: ' + error.message);
        return;
      }
    }

    setShowForm(false);
    await loadData();
  };

  const removeProduct = async (id: string) => {
    if (!window.confirm('Удалить товар?')) return;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Ошибка удаления: ' + error.message);
      return;
    }
    await loadData();
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={login} className="bg-white shadow-lg rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Вход в админ-панель</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <button onClick={logout} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          <LogOut size={18} /> Выйти
        </button>
      </div>

      <div className="flex gap-4 border-b pb-2 mb-4">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 ${tab === 'products' ? 'border-b-2 border-orange-500 font-semibold' : ''}`}
        >
          Товары
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 ${tab === 'orders' ? 'border-b-2 border-orange-500 font-semibold' : ''}`}
        >
          Заказы ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        <div>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 mb-4"
          >
            <Plus size={18} /> Добавить товар
          </button>

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{editing ? 'Редактировать' : 'Добавить'} товар</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={saveProduct} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Название</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Тип</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="лист">Лист</option>
                      <option value="труба круглая">Труба круглая</option>
                      <option value="труба квадратная">Труба квадратная</option>
                      <option value="труба прямоугольная">Труба прямоугольная</option>
                      <option value="уголок">Уголок</option>
                      <option value="швеллер">Швеллер</option>
                      <option value="арматура">Арматура</option>
                      <option value="двутавр">Двутавр</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Марка стали</label>
                    <input
                      type="text"
                      value={form.steelMark}
                      onChange={(e) => setForm({ ...form, steelMark: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium">Толщина (мм)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={form.thickness}
                        onChange={(e) => setForm({ ...form, thickness: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Длина (м)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={form.length}
                        onChange={(e) => setForm({ ...form, length: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium">Цена (₽/тонна)</label>
                      <input
                        type="number"
                        step="1"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Вес п.м. (кг/м)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.weightPerMeter}
                        onChange={(e) => setForm({ ...form, weightPerMeter: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    {editing ? 'Обновить' : 'Добавить'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Название</th>
                  <th className="px-4 py-2 text-left">Тип</th>
                  <th className="px-4 py-2 text-left">Марка</th>
                  <th className="px-4 py-2 text-left">Толщина</th>
                  <th className="px-4 py-2 text-left">Длина</th>
                  <th className="px-4 py-2 text-left">Цена</th>
                  <th className="px-4 py-2 text-left">Вес</th>
                  <th className="px-4 py-2 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.type}</td>
                    <td className="px-4 py-2">{p.steelMark}</td>
                    <td className="px-4 py-2">{p.thickness}</td>
                    <td className="px-4 py-2">{p.length}</td>
                    <td className="px-4 py-2">{formatPrice(p.price)}</td>
                    <td className="px-4 py-2">{p.weightPerMeter}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Заказов пока нет</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Заказ №{order.id}</strong></p>
                    <p><strong>Клиент:</strong> {order.customer?.fullName || 'Не указан'}</p>
                    <p><strong>Телефон:</strong> {order.customer?.phone || '-'}</p>
                    <p><strong>Email:</strong> {order.customer?.email || '-'}</p>
                    <p><strong>Адрес:</strong> {order.customer?.address || '-'}</p>
                    <p><strong>Комментарий:</strong> {order.customer?.comment || '-'}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 border-t pt-2">
                  <p><strong>Состав заказа:</strong></p>
                  <ul className="list-disc list-inside text-sm">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} {item.unit} — {formatPrice(item.price)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}