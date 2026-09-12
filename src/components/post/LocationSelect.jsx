import { LOCATIONS } from '../../mocks/locations'

export default function LocationSelect({ value, onChange, label = '거래 희망 장소' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500"
      >
        <option value="" disabled>
          장소를 선택하세요
        </option>
        {LOCATIONS.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}
