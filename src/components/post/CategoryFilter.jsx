import { CATEGORIES } from '../../mocks/categories'

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === c.id
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-600 active:bg-gray-200'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
