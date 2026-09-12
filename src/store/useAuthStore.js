import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '../api/auth'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async ({ username, password }) => {
        const { user, accessToken } = await authApi.login({ username, password })
        localStorage.setItem('accessToken', accessToken)
        set({ user, accessToken, isAuthenticated: true })
        return user
      },

      signup: async ({ username, password, nickname }) => {
        return authApi.signup({ username, password, nickname })
      },

      logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'campus-market-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
