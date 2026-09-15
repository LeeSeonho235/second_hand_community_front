const STATUS_MAP = {
  SELLING: { label: '판매중', className: 'bg-brand-500 text-white' },
  RESERVED: { label: '예약중', className: 'bg-amber-400 text-white' },
  SOLD: { label: '거래완료', className: 'bg-gray-400 text-white' },
}

export default function StatusBadge({ status, className = '' }) {
  const info = STATUS_MAP[status] ?? STATUS_MAP.SELLING
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${info.className} ${className}`}
    >
      {info.label}
    </span>
  )
}

export const STATUS_OPTIONS = Object.entries(STATUS_MAP).map(([value, { label }]) => ({
  value,
  label,
}))
