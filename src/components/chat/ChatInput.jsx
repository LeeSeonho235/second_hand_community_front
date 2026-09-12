import { useState } from 'react'

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-100 bg-white p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="w-full rounded-full bg-gray-100 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="shrink-0 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white disabled:bg-gray-300"
      >
        전송
      </button>
    </form>
  )
}
