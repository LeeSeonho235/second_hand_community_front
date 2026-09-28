import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { addFavorite, removeFavorite } from '../../api/favorites'

export default function PostCard({ post, showWishButton = true, onFavoriteChange }) {
  const navigate = useNavigate()
  const [isFavorited, setIsFavorited] = useState(post.isFavorited)
  const [pending, setPending] = useState(false)

  const handleWishClick = async (e) => {
    e.stopPropagation()
    if (pending) return
    setPending(true)
    const next = !isFavorited
    try {
      await (next ? addFavorite(post.id) : removeFavorite(post.id))
      setIsFavorited(next)
      onFavoriteChange?.(post.id, next)
    } catch (err) {
      alert(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="flex cursor-pointer gap-3 border-b border-gray-100 px-4 py-3 active:bg-gray-50"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
        {post.status !== 'SELLING' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <StatusBadge status={post.status} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
        <p className="text-xs text-gray-400">
          {post.tradePlace?.name} · {formatTimeAgo(post.createdAt)}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="text-base font-bold text-gray-900">{formatPrice(post.price)}</p>
          {post.status === 'SELLING' && <StatusBadge status={post.status} />}
        </div>
        <p className="text-xs text-gray-400">조회 {post.viewCount}</p>
      </div>

      {showWishButton && (
        <button
          onClick={handleWishClick}
          disabled={pending}
          aria-label="찜하기"
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start text-xl"
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  )
}
