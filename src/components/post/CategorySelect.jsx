import { FIELD_CLASS, FieldLabel } from '../common/Input'

export default function CategorySelect({ value, onChange, options = [], label = '카테고리' }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD_CLASS} border-ink`}>
        <option value="" disabled>
          카테고리를 선택하세요
        </option>
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  )
}
