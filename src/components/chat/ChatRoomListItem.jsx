import { useNavigate } from 'react-router-dom'
import { formatTimeAgo } from '../../utils/format'

export default function ChatRoomListItem({ room }) {
  const navigate = useNavigate()
  const deleted = room.post.postDeleted

  return (
    <article
      onClick={() => navigate(`/chats/${room.id}`)}
      className="mx-4 mb-3 flex cursor-pointer items-center gap-4 rounded-3xl bg-canvas p-4 transition-colors hover:bg-primary-pale/40"
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
          deleted ? 'bg-canvas-soft text-xs font-semibold text-mute' : 'bg-primary-pale text-ink-deep'
        }`}
      >
        {deleted ? '삭제됨' : (room.otherUser?.nickname?.[0] ?? '?')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-base font-semibold text-ink">{room.otherUser?.nickname ?? '알 수 없음'}</p>
          {room.lastMessage && (
            <span className="shrink-0 text-xs text-mute">{formatTimeAgo(room.lastMessage.createdAt)}</span>
          )}
        </div>
        <p className="truncate text-xs text-mute">{deleted ? '삭제된 판매글' : room.post.title}</p>
        <p className="mt-0.5 truncate text-sm text-body">{room.lastMessage?.content ?? '대화를 시작해보세요'}</p>
      </div>
    </article>
  )
}
