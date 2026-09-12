import axios from 'axios'

// Spring Boot 백엔드가 준비되면 .env의 VITE_API_BASE_URL만 실제 주소로 바꾸면 됩니다.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 백엔드가 아직 없어서 지금은 mock 데이터로 화면을 완성합니다.
// 배포 전에는 .env의 VITE_USE_MOCK=false 로 바꿔서 실제 API를 호출하세요.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const mockDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
