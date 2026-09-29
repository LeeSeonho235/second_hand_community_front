import { formatTimeAgo } from '../../utils/format'

export default function CommentItem({ comment, canDelete, onDelete }) {
  const author = comment.author

  return (
    <div className="flex gap-3 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas-soft text-sm font-semibold text-ink">
        {author?.nickname?.[0] ?? '?'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-ink">{author?.nickname ?? '알 수 없음'}</p>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs text-mute">{formatTimeAgo(comment.createdAt)}</span>
            {canDelete && (
              <button onClick={() => onDelete(comment.id)} className="text-xs font-semibold text-negative hover:underline">
                삭제
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-base text-body">{comment.content}</p>
      </div>
    </div>
  )
}
