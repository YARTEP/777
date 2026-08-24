import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl font-bold text-brand-orange mb-2">404</p>
      <p className="text-gray-500 mb-6">Страница не найдена</p>
      <Link to="/" className="inline-block bg-brand-orange hover:bg-brand-orangeDark text-white font-medium px-6 py-2.5 rounded-md transition-colors">
        На главную
      </Link>
    </div>
  )
}
