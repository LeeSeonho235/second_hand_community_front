import { useNavigate } from 'react-router-dom'
import AuthButton from './AuthButton'
import { ChevronLeftIcon } from '../common/Icons'

// right를 넘기지 않으면 비로그인일 때만 오른쪽 위에 로그인 버튼을 둡니다. null을 넘기면 비웁니다.
export default function TopBar({ title, right, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) return onBack()
    // 바로 이 페이지로 들어온 경우(뒤로 갈 기록이 없음)에는 홈으로 보냅니다.
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-canvas-soft/90 px-4 backdrop-blur">
      <button
        onClick={handleBack}
        aria-label="뒤로가기"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink transition-colors hover:bg-primary-pale"
      >
        <ChevronLeftIcon />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-ink">{title}</h1>
      <div className="flex shrink-0 items-center">{right === undefined ? <AuthButton hideWhenLoggedIn /> : right}</div>
    </header>
  )
}
