import axios from 'axios'

// Spring Boot 백엔드가 준비되면 .env의 VITE_API_BASE_URL만 실제 주소로 바꾸면 됩니다.
export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/api/v1`,
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

let refreshPromise = null
const refreshAccessToken = async () => {
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
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const code = response?.data?.error?.code
    if (response?.status === 401 && code === 'ACCESS_TOKEN_EXPIRED' && config && !config._retried) {
      config._retried = true
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const token = await refreshPromise
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
        return apiClient(config)
      }
    }
    return Promise.reject(normalizeError(error))
  },
)

const normalizeError = (error) => {
  const apiError = error.response?.data?.error
  const normalized = new Error(apiError?.message ?? '요청 처리 중 오류가 발생했습니다.')
  normalized.code = apiError?.code
  normalized.status = error.response?.status
  return normalized
}

// 성공 응답은 { data: ... } 형태이므로 data.data만 꺼내 씁니다. 204는 본문이 없습니다.
export const unwrap = (response) => response.data?.data

// 백엔드가 아직 없어서 지금은 mock 데이터로 화면을 완성합니다.
// 배포 전에는 .env의 VITE_USE_MOCK=false 로 바꿔서 실제 API를 호출하세요.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
