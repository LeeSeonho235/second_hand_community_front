import { SearchIcon } from '../common/Icons'

export default function SearchBar({ value, onChange, placeholder = '어떤 물건을 찾으세요?' }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-ink bg-canvas px-4 py-3 transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1">
      <SearchIcon className="h-5 w-5 shrink-0 text-mute" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="판매글 검색"
        className="w-full bg-transparent text-base text-ink outline-none placeholder:text-mute"
      />
    </label>
  )
}
