import { apiClient, USE_MOCK, mockDelay } from './client'
import { MOCK_USERS } from '../mocks/users'

export const login = async ({ username, password }) => {
  if (USE_MOCK) {
    await mockDelay()
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    )
    if (!user) {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
    const { password: _password, ...safeUser } = user
    return { user: safeUser, accessToken: `mock-token-${user.id}` }
  }

  const { data } = await apiClient.post('/api/auth/login', { username, password })
  return data
}

export const signup = async ({ username, password, nickname }) => {
  if (USE_MOCK) {
    await mockDelay()
    if (MOCK_USERS.some((u) => u.username === username)) {
      throw new Error('이미 사용 중인 아이디입니다.')
    }
    return { success: true }
  }

  const { data } = await apiClient.post('/api/auth/signup', {
    username,
    password,
    nickname,
  })
  return data
}
