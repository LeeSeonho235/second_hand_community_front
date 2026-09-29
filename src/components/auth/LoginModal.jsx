import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import { CloseIcon } from '../common/Icons'
import { useAuthStore } from '../../store/useAuthStore'

export default function LoginModal() {
  const navigate = useNavigate()
  const open = useAuthStore((s) => s.loginModalOpen)
  const close = useAuthStore((s) => s.closeLoginModal)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, close])

  if (!open) return null

  const handleSignupClick = () => {
    close()
    navigate('/signup')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-canvas p-6 pb-8 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 id="login-modal-title" className="text-[32px] font-black leading-[1.05] tracking-tight text-ink">
            로그인
          </h2>
          <button
            onClick={close}
            aria-label="닫기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas-soft text-ink transition-colors hover:bg-canvas-soft-hover"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="mb-6 text-base text-body">채팅, 찜, 판매글 등록은 로그인 후 이용할 수 있어요.</p>
        <LoginForm onSignupClick={handleSignupClick} />
      </div>
    </div>
  )
}
