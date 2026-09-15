import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'
import { setPostFavorited, getFavoritedPostSummaries } from './posts'

export const addFavorite = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(100)
    setPostFavorited(postId, true)
    return
  }
  await apiClient.put(`/posts/${postId}/favorite`)
}

export const removeFavorite = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(100)
    setPostFavorited(postId, false)
    return
  }
  await apiClient.delete(`/posts/${postId}/favorite`)
}

export const fetchMyFavorites = async ({ cursor, limit = 20 } = {}) => {
  if (USE_MOCK) {
    await mockDelay()
    return { items: getFavoritedPostSummaries(), page: { nextCursor: null, hasNext: false } }
  }

  const response = await apiClient.get('/users/me/favorites', { params: { cursor, limit } })
  return unwrap(response)
}
