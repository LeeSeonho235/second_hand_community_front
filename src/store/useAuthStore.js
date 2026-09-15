import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'
import { setAccessToken, USE_MOCK } from '../api/client'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isRestoring: true,

      login: async ({ email, password }) => {
        const { user } = await authApi.login({ email, password })
        set({ user, isAuthenticated: true })
        return user
      },

      signup: async ({ email, password, nickname }) => {
        return authApi.signup({ email, password, nickname })
      },

      logout: async () => {
        await authApi.logout()
        set({ user: null, isAuthenticated: false })
      },

      // 액세스 토큰은 메모리에만 있어 새로고침하면 사라집니다.
      // 저장된 사용자 정보가 있으면 세션 복구(재로그인 또는 리프레시)를 시도합니다.
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
