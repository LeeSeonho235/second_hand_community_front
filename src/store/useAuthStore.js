import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'
import { setAccessToken, setOnAuthLost, USE_MOCK } from '../api/client'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isRestoring: true,
      // 비로그인 사용자가 로그인이 필요한 기능을 누르면 로그인 모달을 띄웁니다.
      loginModalOpen: false,

      openLoginModal: () => set({ loginModalOpen: true }),
      closeLoginModal: () => set({ loginModalOpen: false }),

      login: async ({ email, password }) => {
        const { user } = await authApi.login({ email, password })
        set({ user, isAuthenticated: true, loginModalOpen: false })
        return user
      },

      signup: async ({ email, password, nickname }) => {
        return authApi.signup({ email, password, nickname })
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          set({ user: null, isAuthenticated: false })
        }
      },

      // 액세스 토큰은 메모리에만 있어 새로고침하면 사라집니다.
      // 저장된 사용자 정보가 있으면 리프레시 쿠키로 세션 복구를 시도합니다.
      restoreSession: async () => {
        const { user } = get()
        if (!user) {
          set({ isRestoring: false })
          return
        }
        try {
          if (USE_MOCK) {
            setAccessToken(`mock-token-${user.id}`)
          } else {
            await authApi.refresh()
          }
          set({ isAuthenticated: true, isRestoring: false })
        } catch {
          set({ user: null, isAuthenticated: false, isRestoring: false })
        }
      },
    }),
    {
      name: 'campus-market-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

setOnAuthLost(() => useAuthStore.setState({ user: null, isAuthenticated: false }))
