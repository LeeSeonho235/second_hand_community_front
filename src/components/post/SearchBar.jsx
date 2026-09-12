export default function SearchBar({ value, onChange, placeholder = '어떤 물건을 찾으세요?' }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
      <span className="text-gray-400">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  )
}
