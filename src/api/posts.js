import { apiClient, USE_MOCK, mockDelay } from './client'
import { MOCK_POSTS } from '../mocks/posts'
import { generateId } from '../utils/format'

// mock 모드에서는 새로고침 전까지 등록/수정/삭제가 유지되도록 메모리에 복제해둡니다.
let postsStore = [...MOCK_POSTS]

export const fetchPosts = async ({ keyword = '', category = 'all' } = {}) => {
  if (USE_MOCK) {
    await mockDelay()
    return postsStore
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => p.title.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const { data } = await apiClient.get('/api/posts', { params: { keyword, category } })
  return data
}

export const fetchPostById = async (postId) => {
  if (USE_MOCK) {
    await mockDelay()
    const post = postsStore.find((p) => p.id === postId)
    if (!post) throw new Error('존재하지 않는 판매글입니다.')
    post.viewCount += 1
    return post
  }

  const { data } = await apiClient.get(`/api/posts/${postId}`)
  return data
}

// 조회수를 올리지 않고 여러 판매글을 한번에 가져올 때 사용합니다 (채팅목록, 찜목록 등).
export const fetchPostsByIds = async (postIds) => {
  if (USE_MOCK) {
    await mockDelay(150)
    return postsStore.filter((p) => postIds.includes(p.id))
  }

  const { data } = await apiClient.get('/api/posts', { params: { ids: postIds.join(',') } })
  return data
}

export const fetchPostsBySeller = async (sellerId) => {
  if (USE_MOCK) {
    await mockDelay()
    return postsStore
      .filter((p) => p.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const { data } = await apiClient.get(`/api/users/${sellerId}/posts`)
  return data
}

export const createPost = async (payload) => {
  if (USE_MOCK) {
    await mockDelay()
    const newPost = {
      id: generateId('p'),
      status: 'selling',
      viewCount: 0,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    postsStore = [newPost, ...postsStore]
    return newPost
  }

  const { data } = await apiClient.post('/api/posts', payload)
  return data
}

export const updatePost = async (postId, payload) => {
  if (USE_MOCK) {
    await mockDelay()
    postsStore = postsStore.map((p) => (p.id === postId ? { ...p, ...payload } : p))
    return postsStore.find((p) => p.id === postId)
  }

  const { data } = await apiClient.put(`/api/posts/${postId}`, payload)
  return data
}

export const updatePostStatus = async (postId, status) => updatePost(postId, { status })

export const deletePost = async (postId) => {
  if (USE_MOCK) {
    await mockDelay()
    postsStore = postsStore.filter((p) => p.id !== postId)
    return { success: true }
  }

  const { data } = await apiClient.delete(`/api/posts/${postId}`)
  return data
}
