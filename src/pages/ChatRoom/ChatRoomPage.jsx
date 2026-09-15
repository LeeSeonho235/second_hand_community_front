import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ChatBubble from '../../components/chat/ChatBubble'
import ChatInput from '../../components/chat/ChatInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchChatRoomById, fetchMessages, sendMessage, mockAutoReply } from '../../api/chat'
import { fetchPostById } from '../../api/posts'
import { formatPrice } from '../../utils/format'
import { useAuthStore } from '../../store/useAuthStore'

const POLL_INTERVAL_MS = 3000

export default function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [room, setRoom] = useState(null)
  const [post, setPost] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const lastSequenceRef = useRef(0)

  useEffect(() => {
    let ignore = false
    fetchChatRoomById(roomId).then(async (r) => {
      if (ignore) return
      setRoom(r)
      const result = await fetchMessages(roomId)
      if (ignore) return
      setMessages(result.items)
      lastSequenceRef.current = result.items[result.items.length - 1]?.sequence ?? 0
      setLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [roomId])

  useEffect(() => {
    if (!room || room.post.postDeleted) return
    fetchPostById(room.post.id).then(setPost).catch(() => setPost(null))
  }, [room])

  // 실시간 서버 푸시(WebSocket) 없이 REST 폴링으로 새 메시지를 받아옵니다.
  useEffect(() => {
    if (!room) return
    const interval = setInterval(async () => {
      const result = await fetchMessages(roomId, { afterSequence: lastSequenceRef.current })
      if (result.items.length > 0) {
        setMessages((prev) => [...prev, ...result.items])
        lastSequenceRef.current = result.nextAfterSequence
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [room, roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (loading || !room) {
    return (
      <div>
        <TopBar title="채팅방" />
        <LoadingSpinner />
      </div>
    )
  }

  const handleSend = async (content) => {
    const clientMessageId = crypto.randomUUID()
    const message = await sendMessage(room.id, { clientMessageId, content })
    setMessages((prev) => [...prev, message])
    lastSequenceRef.current = message.sequence
    mockAutoReply(room.id).then((reply) => {
      if (reply) {
        setMessages((prev) => [...prev, reply])
        lastSequenceRef.current = reply.sequence
      }
    })
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <TopBar title={room.otherUser?.nickname ?? '채팅방'} />

      {post && (
        <button
          onClick={() => navigate(`/posts/${post.id}`)}
          className="flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left"
        >
          <img src={post.thumbnailUrl} alt={post.title} className="h-12 w-12 rounded-lg bg-gray-100 object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">{post.title}</p>
            <p className="text-sm font-semibold text-gray-900">{formatPrice(post.price)}</p>
          </div>
        </button>
      )}

      <div className="flex-1 overflow-y-auto py-3">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} isMine={message.sender?.id === currentUser.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
