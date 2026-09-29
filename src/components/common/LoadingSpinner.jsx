export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`} role="status" aria-label="불러오는 중">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink/10 border-t-ink" />
    </div>
  )
}
