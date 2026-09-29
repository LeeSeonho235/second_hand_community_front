import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Button from '../components/common/Button'
import TopBar from '../components/layout/TopBar'
import { useAuthStore } from '../store/useAuthStore'

// 비로그인 상태로 들어오면 로그인 모달을 띄우고, 로그인하면 그 자리에서 바로 화면을 보여줍니다.
function LoginRequired() {
  const navigate = useNavigate()
  const openLoginModal = useAuthStore((s) => s.openLoginModal)

  useEffect(() => {
    openLoginModal()
  }, [openLoginModal])

  return (
    <div>
      <TopBar title="" right={null} onBack={() => navigate('/', { replace: true })} />
      <div className="mx-4 mt-2 rounded-3xl bg-canvas p-6">
        <h2 className="text-[32px] font-black leading-[1.05] tracking-tight text-ink">
          로그인이
          <br />
          필요해요
        </h2>
        <p className="mt-3 text-base text-body">채팅, 찜 목록, 마이페이지, 판매글 등록은 로그인 후 이용할 수 있어요.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={openLoginModal}>로그인하기</Button>
          <Button variant="secondary" onClick={() => navigate('/', { replace: true })}>
            둘러보기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isRestoring = useAuthStore((s) => s.isRestoring)

  if (isRestoring) return <LoadingSpinner />
  if (!isAuthenticated) return <LoginRequired />
  return <Outlet />
}
