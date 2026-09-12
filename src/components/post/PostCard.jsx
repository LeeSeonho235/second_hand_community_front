import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { getLocationLabel } from '../../mocks/locations'
import { useWishlistStore } from '../../store/useWishlistStore'

export default function PostCard({ post, showWishButton = true }) {
  const navigate = useNavigate()
  const isWished = useWishlistStore((s) => s.isWished(post.id))
  const toggleWish = useWishlistStore((s) => s.toggle)

  const handleWishClick = (e) => {
    e.stopPropagation()
    toggleWish(post.id)
  }

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="flex cursor-pointer gap-3 border-b border-gray-100 px-4 py-3 active:bg-gray-50"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover" />
        {post.status !== 'selling' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <StatusBadge status={post.status} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
        <p className="text-xs text-gray-400">
          {getLocationLabel(post.location)} · {formatTimeAgo(post.createdAt)}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="text-base font-bold text-gray-900">{formatPrice(post.price)}</p>
          {post.status === 'selling' && <StatusBadge status={post.status} />}
        </div>
        <p className="text-xs text-gray-400">조회 {post.viewCount}</p>
      </div>

      {showWishButton && (
        <button
          onClick={handleWishClick}
          aria-label="찜하기"
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start text-xl"
        >
          {isWished ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}
