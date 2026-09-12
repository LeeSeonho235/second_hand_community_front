import { apiClient, USE_MOCK, mockDelay } from './client'
import { MOCK_COMMENTS } from '../mocks/comments'
import { generateId } from '../utils/format'

let commentsStore = [...MOCK_COMMENTS]

export const fetchComments = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(150)
    return commentsStore
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }

  const { data } = await apiClient.get(`/api/posts/${postId}/comments`)
  return data
}

export const createComment = async ({ postId, authorId, content }) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const newComment = {
      id: generateId('c'),
      postId,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    }
    commentsStore = [...commentsStore, newComment]
    return newComment
  }

  const { data } = await apiClient.post(`/api/posts/${postId}/comments`, { content })
  return data
}

export const deleteComment = async (commentId) => {
  if (USE_MOCK) {
    await mockDelay(150)
    commentsStore = commentsStore.filter((c) => c.id !== commentId)
    return { success: true }
  }

  const { data } = await apiClient.delete(`/api/comments/${commentId}`)
  return data
}
