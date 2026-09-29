import axios from 'axios'

// 기본은 같은 도메인의 /api/v1 입니다. Vercel(vercel.json)과 개발 서버(vite.config.js)가 백엔드로 넘겨줍니다.
// 다른 백엔드를 직접 부르려면 .env의 VITE_API_BASE_URL에 주소를 넣으세요.
export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 리프레시 토큰 HttpOnly 쿠키 전달용
})

// 액세스 토큰은 명세대로 메모리에만 보관합니다 (localStorage에 저장하지 않음).
let accessToken = null
export const setAccessToken = (token) => {
  accessToken = token
}
export const getAccessToken = () => accessToken

let csrfToken = null
export const clearCsrfToken = () => {
  csrfToken = null
}
const fetchCsrfToken = async () => {
  const response = await apiClient.get('/auth/csrf')
  csrfToken = unwrap(response).csrfToken
  return csrfToken
}
// 회원가입·로그인·갱신·로그아웃·조회 이벤트 호출에는 CSRF 토큰이 필요합니다.
export const withCsrf = async (config = {}) => {
  const token = csrfToken ?? (await fetchCsrfToken())
  return { ...config, headers: { ...config.headers, 'X-CSRF-Token': token } }
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// 로그인이 풀렸을 때(갱신 실패, 폐기된 토큰 등) 화면 상태를 비우도록 스토어가 등록하는 콜백입니다.
let onAuthLost = null
export const setOnAuthLost = (callback) => {
  onAuthLost = callback
}
const AUTH_LOST_CODES = ['UNAUTHENTICATED', 'INVALID_TOKEN', 'TOKEN_REVOKED']

// 리프레시 토큰은 사용할 때마다 교체되므로, 동시에 두 번 갱신하면 재사용으로 판정됩니다.
// 진행 중인 갱신이 있으면 그 결과를 함께 기다립니다. 실패하면 null을 반환합니다.
let refreshPromise = null
export const refreshAccessToken = () => {
  refreshPromise ??= (async () => {
    try {
      const csrfConfig = await withCsrf()
      const response = await apiClient.post('/auth/refresh', null, csrfConfig)
      const token = unwrap(response).accessToken
      setAccessToken(token)
      return token
    } catch {
      setAccessToken(null)
      return null
    }
  })().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const code = response?.data?.error?.code
    // CSRF 쿠키가 만료(2시간)되면 토큰을 새로 받아 한 번만 다시 시도합니다.
    if (response?.status === 403 && code === 'CSRF_INVALID' && config && !config._csrfRetried) {
      config._csrfRetried = true
      const token = await fetchCsrfToken()
      config.headers = { ...config.headers, 'X-CSRF-Token': token }
      return apiClient(config)
    }
    if (response?.status === 401 && code === 'ACCESS_TOKEN_EXPIRED' && config && !config._retried) {
      config._retried = true
      const token = await refreshAccessToken()
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
        return apiClient(config)
      }
      onAuthLost?.()
    } else if (response?.status === 401 && AUTH_LOST_CODES.includes(code) && accessToken) {
      setAccessToken(null)
      onAuthLost?.()
    }
    return Promise.reject(normalizeError(error))
  },
)

const normalizeError = (error) => {
  const apiError = error.response?.data?.error
  const normalized = new Error(apiError?.message ?? '요청 처리 중 오류가 발생했습니다.')
  normalized.code = apiError?.code
  normalized.status = error.response?.status
  // VALIDATION_ERROR의 details는 ["password: 크기가 8에서 72 사이여야 합니다"] 형태입니다.
  normalized.fieldErrors = Object.fromEntries(
    (apiError?.details ?? [])
      .map((detail) => String(detail).split(/:\s*(.*)/s))
      .filter(([field, message]) => field && message),
  )
  return normalized
}

// 성공 응답은 { data: ... } 형태이므로 data.data만 꺼내 씁니다. 204는 본문이 없습니다.
export const unwrap = (response) => response.data?.data

// 기본은 실제 API 호출입니다. mock 데이터로 보려면 .env에 VITE_USE_MOCK=true 를 넣으세요.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
