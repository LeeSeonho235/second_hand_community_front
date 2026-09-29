import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PostThumbnail from './PostThumbnail'
import { HeartIcon } from '../common/Icons'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { addFavorite, removeFavorite } from '../../api/favorites'
import { useRequireLogin } from '../../hooks/useRequireLogin'

export default function PostCard({ post, showWishButton = true, onFavoriteChange }) {
  const navigate = useNavigate()
  const requireLogin = useRequireLogin()
  const [isFavorited, setIsFavorited] = useState(post.isFavorited)
  const [pending, setPending] = useState(false)

  // 로그인 후 목록을 다시 받으면 서버의 찜 상태로 맞춥니다.
  useEffect(() => {
    setIsFavorited(post.isFavorited)
  }, [post.isFavorited])

  const toggleFavorite = async () => {
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

  const handleWishClick = (e) => {
    e.stopPropagation()
    requireLogin(toggleFavorite)
  }

  return (
    <article
      onClick={() => navigate(`/posts/${post.id}`)}
      className="mx-4 mb-3 flex cursor-pointer gap-4 rounded-3xl bg-canvas p-4 transition-colors hover:bg-primary-pale/40"
    >
      <PostThumbnail src={post.thumbnailUrl} alt={post.title} className="h-24 w-24 shrink-0 rounded-2xl" />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <h3 className="truncate text-base font-semibold text-ink">{post.title}</h3>
        <p className="truncate text-sm text-mute">
          {post.tradePlace?.name} · {formatTimeAgo(post.createdAt)}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-lg font-black text-ink">{formatPrice(post.price)}</p>
          <StatusBadge status={post.status} />
        </div>
        <p className="text-xs text-mute">
          조회 {post.viewCount} · 찜 {post.favoriteCount}
        </p>
      </div>

      {showWishButton && (
        <button
          onClick={handleWishClick}
          disabled={pending}
          aria-label={isFavorited ? '찜 취소' : '찜하기'}
          aria-pressed={isFavorited}
          className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full bg-canvas-soft text-ink transition-colors hover:bg-canvas-soft-hover"
        >
          <HeartIcon filled={isFavorited} />
        </button>
      )}
    </article>
  )
}
