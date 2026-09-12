import { apiClient, USE_MOCK, mockDelay } from './client'
import { MOCK_CHAT_ROOMS, AUTO_REPLIES } from '../mocks/chats'
import { generateId } from '../utils/format'

let chatRoomsStore = [...MOCK_CHAT_ROOMS]

export const fetchChatRooms = async (userId) => {
  if (USE_MOCK) {
    await mockDelay()
    return chatRoomsStore.filter(
      (room) => room.buyerId === userId || room.sellerId === userId,
    )
  }

  const { data } = await apiClient.get('/api/chat-rooms')
  return data
}

export const fetchChatRoomById = async (roomId) => {
  if (USE_MOCK) {
    await mockDelay(150)
    const room = chatRoomsStore.find((r) => r.id === roomId)
    if (!room) throw new Error('존재하지 않는 채팅방입니다.')
    return room
  }

  const { data } = await apiClient.get(`/api/chat-rooms/${roomId}`)
  return data
}

// 판매글 상세에서 "채팅하기"를 누르면 기존 방이 있으면 재사용하고 없으면 새로 만듭니다.
export const findOrCreateChatRoom = async ({ postId, buyerId, sellerId }) => {
  if (USE_MOCK) {
    await mockDelay(150)
    let room = chatRoomsStore.find(
      (r) => r.postId === postId && r.buyerId === buyerId && r.sellerId === sellerId,
    )
    if (!room) {
      room = { id: generateId('room'), postId, buyerId, sellerId, messages: [] }
      chatRoomsStore = [room, ...chatRoomsStore]
    }
    return room
  }

  const { data } = await apiClient.post('/api/chat-rooms', { postId, sellerId })
  return data
}

export const sendMessage = async (roomId, { senderId, text }) => {
  if (USE_MOCK) {
    await mockDelay(100)
    const message = { id: generateId('m'), senderId, text, createdAt: new Date().toISOString() }
    chatRoomsStore = chatRoomsStore.map((room) =>
      room.id === roomId ? { ...room, messages: [...room.messages, message] } : room,
    )
    return message
  }

  const { data } = await apiClient.post(`/api/chat-rooms/${roomId}/messages`, { text })
  return data
}

// 실제 백엔드(WebSocket 등) 연동 전까지 상대방 응답을 흉내내기 위한 mock 전용 함수입니다.
export const mockAutoReply = async (roomId, replierId) => {
  if (!USE_MOCK) return null
  await mockDelay(800)
  const text = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
  return sendMessage(roomId, { senderId: replierId, text })
}
