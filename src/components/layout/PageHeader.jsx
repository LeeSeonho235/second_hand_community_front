import AuthButton from './AuthButton'

// right를 넘기지 않으면 오른쪽 위에 로그인/프로필 버튼을 둡니다. null을 넘기면 비웁니다.
export default function PageHeader({ title, right }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-canvas-soft/90 px-4 backdrop-blur">
      <h1 className="text-2xl font-black tracking-tight text-ink">{title}</h1>
      {right === undefined ? <AuthButton /> : right}
    </header>
  )
}
