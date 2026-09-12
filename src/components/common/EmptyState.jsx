export default function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-semibold text-gray-700">{title}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  )
}
