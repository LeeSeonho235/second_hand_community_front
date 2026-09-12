import { findUserById } from '../../mocks/users'
import { formatTimeAgo } from '../../utils/format'

export default function CommentItem({ comment, canDelete, onDelete }) {
  const author = findUserById(comment.authorId)

  return (
    <div className="flex gap-2 px-4 py-3">
      <img
        src={author?.avatar}
        alt={author?.nickname}
        className="h-8 w-8 shrink-0 rounded-full bg-gray-100 object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">{author?.nickname ?? '알 수 없음'}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
            {canDelete && (
              <button onClick={() => onDelete(comment.id)} className="text-xs text-gray-400 underline">
                삭제
              </button>
            )}
          </div>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-700">{comment.content}</p>
      </div>
    </div>
  )
}
