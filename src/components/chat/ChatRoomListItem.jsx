import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '../../utils/format'

export default function ChatRoomListItem({ room, partner, post }) {
  const navigate = useNavigate()
  const lastMessage = room.messages[room.messages.length - 1]

  return (
    <div
      onClick={() => navigate(`/chats/${room.id}`)}
      className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 active:bg-gray-50"
    >
      <img
        src={post?.images?.[0]}
        alt={post?.title}
        className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-semibold text-gray-900">{partner?.nickname ?? '알 수 없음'}</p>
          {lastMessage && (
            <span className="shrink-0 text-xs text-gray-400">{formatTimeAgo(lastMessage.createdAt)}</span>
          )}
        </div>
        <p className="truncate text-xs text-gray-400">{post?.title}</p>
        <p className="truncate text-sm text-gray-600">{lastMessage?.text ?? '대화를 시작해보세요'}</p>
      </div>
    </div>
  )
}
