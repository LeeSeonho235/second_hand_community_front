const VARIANTS = {
  primary: 'bg-brand-500 text-white active:bg-brand-600 disabled:bg-gray-300',
  secondary: 'bg-gray-100 text-gray-700 active:bg-gray-200 disabled:text-gray-400',
  outline: 'border border-gray-300 text-gray-700 active:bg-gray-50 disabled:text-gray-300',
  danger: 'bg-red-50 text-red-500 active:bg-red-100',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  fullWidth = true,
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'py-2 text-sm' : 'py-3 text-base'
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} ${sizeClass} rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
