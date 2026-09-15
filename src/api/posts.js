import { apiClient, USE_MOCK, mockDelay, unwrap, withCsrf } from './client'
import { MOCK_POSTS } from '../mocks/posts'
import { findCategoryById } from '../mocks/categories'
import { findTradePlaceById } from '../mocks/tradePlaces'
import { findUserById, toPublicUser } from '../mocks/users'
import { getMockImageById } from './images'
import { useAuthStore } from '../store/useAuthStore'

// mock 모드에서는 새로고침 전까지 등록/수정/삭제가 유지되도록 메모리에 복제해둡니다.
let postsStore = MOCK_POSTS.map((p) => ({ ...p, images: [...p.images] }))

// mock 모드는 로그인한 한 사용자만 시뮬레이션하므로 찜 상태를 별도 맵으로 관리합니다.
const favoritedAt = new Map() // postId -> ISO string
// `${postId}:${viewerKey}` 조합으로 24시간 내 중복 조회를 막습니다 (mock에서는 세션 단위로 단순화).
const viewedKeys = new Set()

const currentUserId = () => useAuthStore.getState().user?.id

const toSummary = (record) => ({
  id: record.id,
  title: record.title,
  price: record.price,
  status: record.status,
  thumbnailUrl: record.images[0]?.url ?? null,
  category: findCategoryById(record.categoryId),
  tradePlace: findTradePlaceById(record.tradePlaceId),
  seller: toPublicUser(findUserById(record.sellerId)),
  viewCount: record.viewCount,
  favoriteCount: record.favoriteCount,
  isFavorited: favoritedAt.has(record.id),
  createdAt: record.createdAt,
})

const toDetail = (record) => ({
  ...toSummary(record),
  description: record.description,
  images: record.images,
  version: record.version,
  updatedAt: record.updatedAt,
})

const findRecord = (postId) => {
  const record = postsStore.find((p) => p.id === postId)
  if (!record) throw new Error('존재하지 않는 판매글입니다.')
  return record
}

// chat.js 등 다른 mock 모듈에서 판매글 원본 레코드가 필요할 때 사용합니다.
export const getMockPostRecord = (postId) => postsStore.find((p) => p.id === postId) ?? null

// favorites.js에서 위임 호출합니다 (PostSummary/PostDetail에 찜 상태·개수가 내장되어 있어 이곳에서 관리).
export const setPostFavorited = (postId, favorited) => {
  const record = findRecord(postId)
  const already = favoritedAt.has(postId)
  if (favorited === already) return // 멱등: 이미 같은 상태면 아무 변화 없음
  if (favorited) {
    favoritedAt.set(postId, new Date().toISOString())
    record.favoriteCount += 1
  } else {
    favoritedAt.delete(postId)
    record.favoriteCount = Math.max(0, record.favoriteCount - 1)
  }
}

export const getFavoritedPostSummaries = () =>
  postsStore
    .filter((p) => favoritedAt.has(p.id))
    .sort((a, b) => new Date(favoritedAt.get(b.id)) - new Date(favoritedAt.get(a.id)))
    .map((record) => ({ post: toSummary(record), favoritedAt: favoritedAt.get(record.id) }))

const paginate = (list, cursor, limit) => {
  const startIndex = cursor ? list.findIndex((p) => p.id === cursor) + 1 : 0
  const items = list.slice(startIndex, startIndex + limit)
  const hasNext = startIndex + limit < list.length
  return { items, page: { nextCursor: hasNext ? (items[items.length - 1]?.id ?? null) : null, hasNext } }
}

export const fetchPosts = async ({ q = '', categoryId, status, sellerId, cursor, limit = 20 } = {}) => {
  if (USE_MOCK) {
    await mockDelay()
    const filtered = postsStore
      .filter((p) => !categoryId || p.categoryId === categoryId)
      .filter((p) => !status || p.status === status)
      .filter((p) => !sellerId || p.sellerId === sellerId)
      .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const { items, page } = paginate(filtered, cursor, limit)
    return { items: items.map(toSummary), page }
  }

  // sellerId는 "내 판매글" 조회를 위해 명세를 확장한 파라미터입니다 (명세에 별도 엔드포인트가 없음).
  const response = await apiClient.get('/posts', { params: { q, categoryId, status, sellerId, cursor, limit } })
  return unwrap(response)
}

export const fetchPostsBySeller = async (sellerId) => {
  const { items } = await fetchPosts({ sellerId, limit: 100 })
  return items
}

export const fetchPostById = async (postId) => {
  if (USE_MOCK) {
    await mockDelay()
    return toDetail(findRecord(postId))
  }

  const response = await apiClient.get(`/posts/${postId}`)
  return unwrap(response)
}

// 상세 조회와 별도로 호출하는 조회 이벤트입니다. 회원은 계정, 비회원은 세션 기준으로 글당 1회만 집계합니다.
export const recordPostView = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(50)
    const record = findRecord(postId)
    const viewerKey = currentUserId() ?? 'guest'
    if (record.sellerId === viewerKey) {
      return { viewCount: record.viewCount, counted: false }
    }
    const dedupeKey = `${postId}:${viewerKey}`
    if (viewedKeys.has(dedupeKey)) {
      return { viewCount: record.viewCount, counted: false }
    }
    viewedKeys.add(dedupeKey)
    record.viewCount += 1
    return { viewCount: record.viewCount, counted: true }
  }

  const response = await apiClient.post(`/posts/${postId}/views`, null, await withCsrf())
  return unwrap(response)
}

export const createPost = async ({ title, description, price, categoryId, tradePlaceId, imageIds = [] }) => {
  if (USE_MOCK) {
    await mockDelay()
    const now = new Date().toISOString()
    const record = {
      id: `p_${Date.now()}`,
      title,
      description,
      price,
      categoryId,
      tradePlaceId,
      status: 'SELLING',
      images: imageIds.map(getMockImageById).filter(Boolean),
      sellerId: currentUserId(),
      viewCount: 0,
      favoriteCount: 0,
      version: 1,
      createdAt: now,
      updatedAt: now,
    }
    postsStore = [record, ...postsStore]
    return toDetail(record)
  }

  const response = await apiClient.post('/posts', { title, description, price, categoryId, tradePlaceId, imageIds })
  return unwrap(response)
}

const versionConflictError = () => {
  const error = new Error('다른 곳에서 이미 수정된 판매글입니다. 새로고침 후 다시 시도해주세요.')
  error.code = 'VERSION_CONFLICT'
  return error
}

export const updatePost = async (postId, { version, imageIds, ...fields }) => {
  if (USE_MOCK) {
    await mockDelay()
    const record = findRecord(postId)
    if (record.version !== version) throw versionConflictError()
    if (record.status === 'SOLD') {
      const error = new Error('거래완료된 판매글은 수정할 수 없습니다.')
      error.code = 'INVALID_STATUS_TRANSITION'
      throw error
    }
    Object.assign(record, fields)
    if (imageIds) record.images = imageIds.map(getMockImageById).filter(Boolean)
    record.version += 1
    record.updatedAt = new Date().toISOString()
    return toDetail(record)
  }

  const response = await apiClient.patch(`/posts/${postId}`, { version, imageIds, ...fields })
  return unwrap(response)
}

// SELLING <-> RESERVED는 자유롭게, 두 상태에서 SOLD로만 전이 가능합니다. SOLD는 종료 상태입니다.
const STATUS_TRANSITIONS = { SELLING: ['RESERVED', 'SOLD'], RESERVED: ['SELLING', 'SOLD'], SOLD: [] }

export const updatePostStatus = async (postId, { status, version }) => {
  if (USE_MOCK) {
    await mockDelay()
    const record = findRecord(postId)
    if (record.version !== version) throw versionConflictError()
    if (record.status !== status && !STATUS_TRANSITIONS[record.status].includes(status)) {
      const error = new Error('허용되지 않는 거래 상태 변경입니다.')
      error.code = 'INVALID_STATUS_TRANSITION'
      throw error
    }
    record.status = status
    record.version += 1
    record.updatedAt = new Date().toISOString()
    return toDetail(record)
  }

  const response = await apiClient.patch(`/posts/${postId}/status`, { status, version })
  return unwrap(response)
}

export const deletePost = async (postId, version) => {
  if (USE_MOCK) {
    await mockDelay()
    const record = findRecord(postId)
    if (record.version !== version) throw versionConflictError()
    postsStore = postsStore.filter((p) => p.id !== postId)
    return
  }

  await apiClient.delete(`/posts/${postId}`, { params: { version } })
}
