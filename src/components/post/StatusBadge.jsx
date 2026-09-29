// 거래 상태는 의미 색(초록 계열·노랑·잉크)으로 표시하고, CTA용 라임 그린은 쓰지 않습니다.
const STATUS_MAP = {
  SELLING: { label: '판매중', className: 'bg-primary-pale text-positive-deep' },
  RESERVED: { label: '예약중', className: 'bg-warning text-warning-content' },
  SOLD: { label: '거래완료', className: 'bg-ink text-canvas-soft' },
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
