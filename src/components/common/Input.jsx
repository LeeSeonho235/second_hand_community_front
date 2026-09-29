// 입력칸·선택칸·텍스트영역이 함께 쓰는 스타일입니다: 흰 바탕, 1px 잉크 테두리, 12px 라운드.
export const FIELD_CLASS =
  'w-full rounded-xl border bg-canvas px-4 py-3 text-base text-ink outline-none transition-shadow placeholder:text-mute focus:ring-2 focus:ring-primary focus:ring-offset-1'

export const FieldLabel = ({ children }) => (
  <span className="mb-1.5 block text-sm font-semibold text-ink">{children}</span>
)

export const FieldError = ({ children }) =>
  children ? <span className="mt-1.5 block text-sm text-negative">{children}</span> : null

export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        className={`${FIELD_CLASS} ${error ? 'border-negative' : 'border-ink'} ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </label>
  )
}
