import { useState } from 'react'
import { SendIcon } from '../common/Icons'

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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-ink/10 bg-canvas px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="메시지를 입력하세요"
        aria-label="메시지 입력"
        className="w-full rounded-3xl bg-canvas-soft px-4 py-3 text-base text-ink outline-none placeholder:text-mute focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="전송"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-ink transition-colors hover:bg-primary-active disabled:bg-canvas-soft disabled:text-mute"
      >
        <SendIcon />
      </button>
    </form>
  )
}
