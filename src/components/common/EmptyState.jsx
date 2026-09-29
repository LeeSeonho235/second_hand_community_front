export default function EmptyState({ icon = '📭', title, description, action = null }) {
  return (
    <div className="mx-4 my-3 flex flex-col items-center justify-center gap-2 rounded-3xl bg-canvas px-6 py-14 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-lg font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-body">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
