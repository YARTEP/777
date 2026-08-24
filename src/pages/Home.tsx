import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('1. Запрос к Supabase начат');
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        console.log('2. Ответ получен:', { data, error });
        
        if (error) {
          console.error('3. Ошибка Supabase:', error);
          setError(error.message);
        } else {
          console.log('4. Данные загружены:', data);
          setData(data || []);
        }
      } catch (err) {
        console.error('5. Исключение:', err);
        setError(String(err));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Проверка Supabase</h1>
      <p>Найдено товаров: {data.length}</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name} — {item.type}</li>
        ))}
      </ul>
    </div>
  );
}