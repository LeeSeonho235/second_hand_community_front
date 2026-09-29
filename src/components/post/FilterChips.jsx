// 카테고리·거래 상태 필터에 쓰는 가로 스크롤 칩입니다. 선택된 칩은 잉크 바탕에 라임 글씨입니다.
export default function FilterChips({ options, value, onChange, className = '' }) {
  return (
    <div className={`no-scrollbar flex gap-2 overflow-x-auto px-4 py-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            value === option.value ? 'bg-ink text-primary' : 'bg-canvas text-body hover:bg-primary-pale hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
