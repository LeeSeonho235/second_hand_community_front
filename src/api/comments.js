import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'
import { MOCK_COMMENTS } from '../mocks/comments'
import { findUserById, toPublicUser } from '../mocks/users'
import { useAuthStore } from '../store/useAuthStore'

let commentsStore = [...MOCK_COMMENTS]

const toComment = (record) => ({
  id: record.id,
  postId: record.postId,
  author: toPublicUser(findUserById(record.authorId)),
  content: record.content,
  createdAt: record.createdAt,
})

export const fetchComments = async (postId, { cursor, limit = 20 } = {}) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const items = commentsStore
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(toComment)
    return { items, page: { nextCursor: null, hasNext: false } }
  }

  const response = await apiClient.get(`/posts/${postId}/comments`, { params: { cursor, limit } })
  return unwrap(response)
}

export const createComment = async (postId, content) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const record = {
      id: `c_${Date.now()}`,
      postId,
      authorId: useAuthStore.getState().user?.id,
      content,
      createdAt: new Date().toISOString(),
    }
    commentsStore = [...commentsStore, record]
    return toComment(record)
  }

  const response = await apiClient.post(`/posts/${postId}/comments`, { content })
  return unwrap(response)
}

export const deleteComment = async (commentId) => {
  if (USE_MOCK) {
    await mockDelay(150)
    commentsStore = commentsStore.filter((c) => c.id !== commentId)
    return
  }

  await apiClient.delete(`/comments/${commentId}`)
}
