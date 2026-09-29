import { useState } from 'react'
import { FIELD_CLASS } from '../common/Input'

export default function CommentInput({ onSubmit }) {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      // 등록에 성공했을 때만 입력칸을 비웁니다. 실패 시에는 onSubmit이 false를 반환합니다.
      const ok = await onSubmit(trimmed)
      if (ok !== false) setValue('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="댓글을 남겨보세요"
        aria-label="댓글 입력"
        className={`${FIELD_CLASS} border-ink`}
      />
      <button
        type="submit"
        disabled={!value.trim() || submitting}
        className="shrink-0 rounded-3xl bg-primary px-5 py-3 text-base font-semibold text-ink transition-colors hover:bg-primary-active disabled:bg-canvas-soft disabled:text-mute"
      >
        등록
      </button>
    </form>
  )
}
