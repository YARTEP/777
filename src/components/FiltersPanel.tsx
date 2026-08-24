import { ProductType, SteelMark, PRODUCT_TYPES, STEEL_MARKS } from '@/types';

export interface Filters {
  search: string;
  type: ProductType | '';
  steelMark: SteelMark | '';
  maxThickness: number;
  maxLength: number;
}

export const defaultFilters: Filters = {
  search: '',
  type: '',
  steelMark: '',
  maxThickness: 20,
  maxLength: 12,
};

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function FiltersPanel({ filters, onChange, onReset }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Поиск по названию</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Например: Уголок, труба, арматура..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/30"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Тип</label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value as ProductType | '' })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#f97316]"
          >
            <option value="">Все</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Марка стали</label>
          <select
            value={filters.steelMark}
            onChange={(e) => onChange({ ...filters, steelMark: e.target.value as SteelMark | '' })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#f97316]"
          >
            <option value="">Все</option>
            {STEEL_MARKS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Толщина, до {filters.maxThickness.toFixed(1)} мм
        </label>
        <input
          type="range"
          min={0}
          max={20}
          step={0.1}
          value={filters.maxThickness}
          onChange={(e) => onChange({ ...filters, maxThickness: parseFloat(e.target.value) })}
          className="w-full accent-[#f97316]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Длина, до {filters.maxLength.toFixed(1)} м
        </label>
        <input
          type="range"
          min={0}
          max={12}
          step={0.1}
          value={filters.maxLength}
          onChange={(e) => onChange({ ...filters, maxLength: parseFloat(e.target.value) })}
          className="w-full accent-[#f97316]"
        />
      </div>

      <button
        onClick={onReset}
        className="w-full text-sm text-gray-500 hover:text-[#f97316] border border-gray-200 hover:border-[#f97316] rounded-lg py-2 transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}
