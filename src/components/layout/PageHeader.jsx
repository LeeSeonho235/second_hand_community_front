export default function PageHeader({ title, right = null }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
      <h1 className="text-lg font-bold text-brand-600">{title}</h1>
      {right}
    </header>
  )
}
