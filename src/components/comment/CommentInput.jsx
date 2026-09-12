import { useState } from 'react'

export default function CommentInput({ onSubmit }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="댓글을 남겨보세요"
        className="w-full rounded-full bg-gray-100 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="shrink-0 text-sm font-semibold text-brand-500 disabled:text-gray-300"
      >
        등록
      </button>
    </form>
  )
}
