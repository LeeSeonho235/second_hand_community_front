import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

// 헤더 오른쪽 위 버튼: 비로그인이면 "로그인", 로그인했으면 프로필(마이페이지로 이동)을 보여줍니다.
export default function AuthButton({ hideWhenLoggedIn = false }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const openLoginModal = useAuthStore((s) => s.openLoginModal)

  if (user) {
    if (hideWhenLoggedIn) return null
    return (
      <button
        onClick={() => navigate('/mypage')}
        aria-label="마이페이지"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-primary"
      >
        {user.nickname?.[0] ?? '?'}
      </button>
    )
  }

  return (
    <button
      onClick={openLoginModal}
      className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-primary-active"
    >
      로그인
    </button>
  )
}
