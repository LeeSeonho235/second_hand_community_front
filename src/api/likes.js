import { apiClient, USE_MOCK, mockDelay } from './client'

export const likePost = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(100)
    return { postId, liked: true }
  }
  const { data } = await apiClient.post(`/api/posts/${postId}/likes`)
  return data
}

export const unlikePost = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(100)
    return { postId, liked: false }
  }
  const { data } = await apiClient.delete(`/api/posts/${postId}/likes`)
  return data
}
