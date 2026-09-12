import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ChatBubble from '../../components/chat/ChatBubble'
import ChatInput from '../../components/chat/ChatInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchChatRoomById, sendMessage, mockAutoReply } from '../../api/chat'
import { fetchPostById } from '../../api/posts'
import { findUserById } from '../../mocks/users'
import { formatPrice } from '../../utils/format'
import { useAuthStore } from '../../store/useAuthStore'

export default function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [room, setRoom] = useState(null)
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchChatRoomById(roomId).then(async (r) => {
      setRoom(r)
      setLoading(false)
    })
  }, [roomId])

  useEffect(() => {
    if (room) {
      // 조회수를 올리지 않는 목록 조회 대신, 상세 정보(가격 등)가 필요해 상세 조회를 사용합니다.
      fetchPostById(room.postId).then(setPost)
    }
  }, [room?.postId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [room?.messages?.length])

  if (loading || !room) {
    return (
      <div>
        <TopBar title="채팅방" />
        <LoadingSpinner />
      </div>
    )
  }

  const partnerId = room.buyerId === currentUser.id ? room.sellerId : room.buyerId
  const partner = findUserById(partnerId)

  const handleSend = async (text) => {
    const message = await sendMessage(room.id, { senderId: currentUser.id, text })
    setRoom((r) => ({ ...r, messages: [...r.messages, message] }))
    mockAutoReply(room.id, partnerId).then((reply) => {
      if (reply) setRoom((r) => ({ ...r, messages: [...r.messages, reply] }))
    })
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <TopBar title={partner?.nickname ?? '채팅방'} />

      {post && (
        <button
          onClick={() => navigate(`/posts/${post.id}`)}
          className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left"
        >
          <img src={post.images[0]} alt={post.title} className="h-12 w-12 rounded-lg bg-gray-100 object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{post.title}</p>
            <p className="text-sm font-semibold text-gray-900">{formatPrice(post.price)}</p>
          </div>
        </button>
      )}

      <div className="flex-1 overflow-y-auto py-3">
        {room.messages.map((message) => (
          <ChatBubble key={message.id} message={message} isMine={message.senderId === currentUser.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
