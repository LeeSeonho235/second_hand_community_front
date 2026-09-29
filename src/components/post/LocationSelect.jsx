import { FIELD_CLASS, FieldLabel } from '../common/Input'

export default function LocationSelect({ value, onChange, options = [], label = '거래 희망 장소' }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD_CLASS} border-ink`}>
        <option value="" disabled>
          장소를 선택하세요
        </option>
        {options.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  )
}
