import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MiB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const mockImages = new Map()

const validateImageFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('JPEG, PNG, WebP 형식의 이미지만 업로드할 수 있습니다.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('이미지는 파일당 최대 10MB까지 업로드할 수 있습니다.')
  }
}

const readImageDimensions = (url) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 0, height: 0 })
    img.src = url
  })

export const uploadImage = async (file) => {
  validateImageFile(file)

  if (USE_MOCK) {
    await mockDelay(200)
    const url = URL.createObjectURL(file)
    const { width, height } = await readImageDimensions(url)
    const image = {
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      url,
      mimeType: file.type,
      size: file.size,
      width,
      height,
    }
    mockImages.set(image.id, image)
    return image
  }

  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return unwrap(response)
}

export const deleteImage = async (imageId) => {
  if (USE_MOCK) {
    await mockDelay(100)
    mockImages.delete(imageId)
    return
  }
  await apiClient.delete(`/images/${imageId}`)
}

// mock 모드에서 판매글 생성 시 imageIds로 업로드된 이미지를 조회하기 위한 헬퍼입니다.
export const getMockImageById = (imageId) => mockImages.get(imageId) ?? null
