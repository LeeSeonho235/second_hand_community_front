// 버튼은 모두 24px 라운드 알약 모양입니다. 라임 그린(primary)은 주요 행동에만 씁니다.
const VARIANTS = {
  primary: 'bg-primary text-ink hover:bg-primary-active active:bg-primary-neutral disabled:bg-canvas-soft disabled:text-mute',
  secondary: 'bg-canvas-soft text-ink hover:bg-canvas-soft-hover disabled:text-mute',
  outline: 'border border-ink bg-canvas text-ink hover:bg-canvas-soft disabled:border-mute disabled:text-mute',
  danger: 'border border-negative bg-canvas text-negative hover:bg-negative hover:text-white active:bg-negative-deep',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  fullWidth = true,
  size = 'md',
  ...props
}) {
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} ${SIZES[size]} rounded-3xl font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
