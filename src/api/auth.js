import { apiClient, USE_MOCK, mockDelay, unwrap, withCsrf, setAccessToken, clearCsrfToken } from './client'
import { MOCK_USERS, findUserByEmail } from '../mocks/users'

export const login = async ({ email, password }) => {
  if (USE_MOCK) {
    await mockDelay()
    const user = findUserByEmail(email)
    if (!user || user.password !== password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
    const { password: _password, ...myUser } = user
    const accessToken = `mock-token-${user.id}`
    setAccessToken(accessToken)
    return { user: myUser, accessToken, tokenType: 'Bearer', expiresIn: 900 }
  }

  const response = await apiClient.post('/auth/login', { email, password }, await withCsrf())
  const result = unwrap(response)
  setAccessToken(result.accessToken)
  return result
}

export const signup = async ({ email, password, nickname }) => {
  if (USE_MOCK) {
    await mockDelay()
    if (findUserByEmail(email)) {
      throw new Error('이미 사용 중인 이메일입니다.')
    }
    if (MOCK_USERS.some((u) => u.nickname === nickname)) {
      throw new Error('이미 사용 중인 닉네임입니다.')
    }
    const user = {
      id: `u_${Date.now()}`,
      email,
      password,
      nickname,
      createdAt: new Date().toISOString(),
    }
    MOCK_USERS.push(user)
    const { password: _password, ...myUser } = user
    return myUser
  }

  const response = await apiClient.post('/auth/signup', { email, password, nickname }, await withCsrf())
  return unwrap(response)
}

export const fetchMe = async () => {
  const response = await apiClient.get('/users/me')
  return unwrap(response)
}

// 액세스 토큰은 메모리에만 있어 새로고침하면 사라집니다. 리프레시 쿠키로 재발급받습니다.
export const refresh = async () => {
  const response = await apiClient.post('/auth/refresh', null, await withCsrf())
  const result = unwrap(response)
  setAccessToken(result.accessToken)
  return result
}

export const logout = async () => {
  try {
    if (USE_MOCK) {
      await mockDelay(100)
    } else {
      await apiClient.post('/auth/logout', null, await withCsrf())
    }
  } finally {
    // 서버 호출이 실패해도 이 브라우저의 로그인 상태는 지웁니다.
    setAccessToken(null)
    clearCsrfToken()
  }
}
