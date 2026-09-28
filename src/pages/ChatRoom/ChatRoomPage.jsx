import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ChatBubble from '../../components/chat/ChatBubble'
import ChatInput from '../../components/chat/ChatInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { fetchChatRoomById, fetchMessages, sendMessage, mockAutoReply } from '../../api/chat'
import { fetchPostById } from '../../api/posts'
import { formatPrice } from '../../utils/format'
import { useAuthStore } from '../../store/useAuthStore'

const POLL_INTERVAL_MS = 3000

// 전송 응답과 폴링 결과에 같은 메시지가 겹쳐 올 수 있어 id 기준으로 합치고 sequence 순으로 정렬합니다.
const mergeMessages = (prev, incoming) => {
  const byId = new Map(prev.map((m) => [m.id, m]))
  incoming.forEach((m) => byId.set(m.id, m))
  return [...byId.values()].sort((a, b) => a.sequence - b.sequence)
}

export default function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [room, setRoom] = useState(null)
  const [post, setPost] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const lastSequenceRef = useRef(0)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const r = await fetchChatRoomById(roomId)
        const result = await fetchMessages(roomId)
        if (ignore) return
        setRoom(r)
        setMessages(result.items)
        lastSequenceRef.current = result.items[result.items.length - 1]?.sequence ?? 0
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
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
      try {
        const result = await fetchMessages(roomId, { afterSequence: lastSequenceRef.current })
        if (result.items.length > 0) {
          setMessages((prev) => mergeMessages(prev, result.items))
          lastSequenceRef.current = Math.max(lastSequenceRef.current, result.nextAfterSequence)
        }
      } catch {
        // 일시적인 네트워크 오류는 다음 폴링에서 다시 시도합니다.
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [room, roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (error) {
    return (
      <div>
        <TopBar title="채팅방" />
        <EmptyState icon="⚠️" title="채팅방을 불러오지 못했어요" description={error} />
      </div>
    )
  }

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
    let message
    try {
      message = await sendMessage(room.id, { clientMessageId, content })
    } catch (err) {
      alert(err.message)
      return
    }
    setMessages((prev) => mergeMessages(prev, [message]))
    mockAutoReply(room.id).then((reply) => {
      if (reply) setMessages((prev) => mergeMessages(prev, [reply]))
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
