import CommentItem from './CommentItem'
import { useAuthStore } from '../../store/useAuthStore'

export default function CommentList({ comments, onDelete }) {
  const currentUser = useAuthStore((s) => s.user)

  if (comments.length === 0) {
    return <p className="px-4 py-6 text-center text-sm text-gray-400">첫 댓글을 남겨보세요!</p>
  }

  return (
    <div className="divide-y divide-gray-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          canDelete={comment.authorId === currentUser?.id}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
