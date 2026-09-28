import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'
import { MOCK_CHAT_ROOMS, AUTO_REPLIES } from '../mocks/chats'
import { findUserById, toPublicUser } from '../mocks/users'
import { getMockPostRecord } from './posts'
import { useAuthStore } from '../store/useAuthStore'

let chatRoomsStore = [...MOCK_CHAT_ROOMS]

const currentUserId = () => useAuthStore.getState().user?.id

const toMessage = (record, roomId) => ({
  id: record.id,
  roomId,
  sender: toPublicUser(findUserById(record.senderId)),
  sequence: record.sequence,
  clientMessageId: record.clientMessageId,
  content: record.content,
  createdAt: record.createdAt,
})

const toRoomSummary = (room) => {
  const viewerId = currentUserId()
  const otherUserId = room.buyerId === viewerId ? room.sellerId : room.buyerId
  const post = getMockPostRecord(room.postId)
  const lastMessage = room.messages[room.messages.length - 1]
  return {
    id: room.id,
    post: post
      ? { id: post.id, title: post.title, status: post.status, postDeleted: false }
      : { id: room.postId, title: '', status: 'SOLD', postDeleted: true },
    otherUser: toPublicUser(findUserById(otherUserId)),
    lastMessage: lastMessage ? toMessage(lastMessage, room.id) : null,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  }
}

export const fetchChatRooms = async ({ cursor, limit = 20 } = {}) => {
  if (USE_MOCK) {
    await mockDelay()
    const viewerId = currentUserId()
    const items = chatRoomsStore
      .filter((r) => r.buyerId === viewerId || r.sellerId === viewerId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(toRoomSummary)
    return { items, page: { nextCursor: null, hasNext: false } }
  }

  const response = await apiClient.get('/chat/rooms', { params: { cursor, limit } })
  return unwrap(response)
}

// 명세에는 채팅방 단건 조회 API가 없어 목록에서 찾아옵니다.
export const fetchChatRoomById = async (roomId) => {
  const { items } = await fetchChatRooms({ limit: 100 })
  const room = items.find((r) => r.id === roomId)
  if (!room) throw new Error('존재하지 않는 채팅방입니다.')
  return room
}

export const findOrCreateChatRoom = async (postId) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const viewerId = currentUserId()
    const post = getMockPostRecord(postId)
    if (!post) throw new Error('존재하지 않는 판매글입니다.')
    if (post.sellerId === viewerId) {
      throw new Error('본인 글에는 채팅방을 개설할 수 없습니다.')
    }
    let room = chatRoomsStore.find((r) => r.postId === postId && r.buyerId === viewerId)
    if (!room) {
      const now = new Date().toISOString()
      room = { id: `room_${Date.now()}`, postId, buyerId: viewerId, sellerId: post.sellerId, messages: [], createdAt: now, updatedAt: now }
      chatRoomsStore = [room, ...chatRoomsStore]
    }
    return toRoomSummary(room)
  }

  const response = await apiClient.post('/chat/rooms', { postId })
  return unwrap(response)
}

export const fetchMessages = async (roomId, { cursor, afterSequence, limit = 30 } = {}) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const room = chatRoomsStore.find((r) => r.id === roomId)
    if (!room) throw new Error('존재하지 않는 채팅방입니다.')

    if (afterSequence !== undefined) {
      const items = room.messages.filter((m) => m.sequence > afterSequence).map((m) => toMessage(m, roomId))
      return {
        items,
        nextAfterSequence: items.length ? items[items.length - 1].sequence : afterSequence,
        hasMore: false,
      }
    }

    const sorted = [...room.messages].sort((a, b) => b.sequence - a.sequence)
    const items = sorted.slice(0, limit).reverse().map((m) => toMessage(m, roomId))
    return { items, page: { nextCursor: null, hasNext: false } }
  }

  if (afterSequence !== undefined) {
    const response = await apiClient.get(`/chat/rooms/${roomId}/messages`, { params: { afterSequence, limit } })
    return unwrap(response)
  }

  // 과거 메시지는 sequence 내림차순으로 오므로, 화면에 그리기 좋게 오름차순으로 뒤집습니다.
  const response = await apiClient.get(`/chat/rooms/${roomId}/messages`, { params: { cursor, limit } })
  const result = unwrap(response)
  return { ...result, items: [...result.items].reverse() }
}

export const sendMessage = async (roomId, { clientMessageId, content }) => {
  if (USE_MOCK) {
    await mockDelay(100)
    const room = chatRoomsStore.find((r) => r.id === roomId)
    if (!room) throw new Error('존재하지 않는 채팅방입니다.')

    const existing = room.messages.find((m) => m.clientMessageId === clientMessageId)
    if (existing) return toMessage(existing, roomId) // 동일 clientMessageId 재전송은 중복 저장하지 않습니다.

    const nextSequence = (room.messages[room.messages.length - 1]?.sequence ?? 0) + 1
    const record = {
      id: `m_${Date.now()}`,
      senderId: currentUserId(),
      content,
      sequence: nextSequence,
      clientMessageId,
      createdAt: new Date().toISOString(),
    }
    room.messages = [...room.messages, record]
    room.updatedAt = record.createdAt
    return toMessage(record, roomId)
  }

  const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, { clientMessageId, content })
  return unwrap(response)
}

// 실제 백엔드(WebSocket 등) 연동 전까지 상대방 응답을 흉내내기 위한 mock 전용 함수입니다.
export const mockAutoReply = async (roomId) => {
  if (!USE_MOCK) return null
  await mockDelay(800)
  const room = chatRoomsStore.find((r) => r.id === roomId)
  if (!room) return null

  const replierId = room.buyerId === currentUserId() ? room.sellerId : room.buyerId
  const content = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
  const nextSequence = (room.messages[room.messages.length - 1]?.sequence ?? 0) + 1
  const record = {
    id: `m_${Date.now()}`,
    senderId: replierId,
    content,
    sequence: nextSequence,
    clientMessageId: `auto_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  room.messages = [...room.messages, record]
  room.updatedAt = record.createdAt
  return toMessage(record, roomId)
}
