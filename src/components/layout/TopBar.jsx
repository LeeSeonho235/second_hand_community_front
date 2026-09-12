import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, right = null, onBack }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-3 py-3">
      <button
        onClick={() => (onBack ? onBack() : navigate(-1))}
        aria-label="뒤로가기"
        className="flex h-8 w-8 items-center justify-center text-xl text-gray-700"
      >
        ‹
      </button>
      <h1 className="flex-1 truncate text-center text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex h-8 w-8 items-center justify-center">{right}</div>
    </header>
  )
}
