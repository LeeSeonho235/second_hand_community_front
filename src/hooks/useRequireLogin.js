import { useCallback } from 'react'
import { useAuthStore } from '../store/useAuthStore'

// 로그인한 사용자면 action을 실행하고, 아니면 로그인 모달을 띄웁니다.
export const useRequireLogin = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openLoginModal = useAuthStore((s) => s.openLoginModal)

  return useCallback(
    (action) => {
      if (!isAuthenticated) {
        openLoginModal()
        return
      }
      return action()
    },
    [isAuthenticated, openLoginModal],
  )
}
