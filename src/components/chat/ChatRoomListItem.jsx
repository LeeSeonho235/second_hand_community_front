import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '../../utils/format'

export default function ChatRoomListItem({ room }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/chats/${room.id}`)}
      className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 active:bg-gray-50"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
        {room.post.postDeleted ? '삭제됨' : (room.post.title?.[0] ?? '')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-semibold text-gray-900">{room.otherUser?.nickname ?? '알 수 없음'}</p>
          {room.lastMessage && (
            <span className="shrink-0 text-xs text-gray-400">{formatTimeAgo(room.lastMessage.createdAt)}</span>
          )}
        </div>
        <p className="truncate text-xs text-gray-400">{room.post.postDeleted ? '삭제된 판매글' : room.post.title}</p>
        <p className="truncate text-sm text-gray-600">{room.lastMessage?.content ?? '대화를 시작해보세요'}</p>
      </div>
    </div>
  )
}
