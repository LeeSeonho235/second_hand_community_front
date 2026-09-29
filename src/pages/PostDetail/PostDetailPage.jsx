import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ImageSlider from '../../components/post/ImageSlider'
import StatusBadge, { STATUS_OPTIONS } from '../../components/post/StatusBadge'
import CommentList from '../../components/comment/CommentList'
import CommentInput from '../../components/comment/CommentInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { HeartIcon } from '../../components/common/Icons'
import { fetchPostById, deletePost, updatePostStatus, recordPostView } from '../../api/posts'
import { fetchComments, createComment, deleteComment } from '../../api/comments'
import { addFavorite, removeFavorite } from '../../api/favorites'
import { findOrCreateChatRoom } from '../../api/chat'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { useAuthStore } from '../../store/useAuthStore'
import { useRequireLogin } from '../../hooks/useRequireLogin'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openLoginModal = useAuthStore((s) => s.openLoginModal)
  const requireLogin = useRequireLogin()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoritePending, setFavoritePending] = useState(false)
  const [error, setError] = useState('')
  const viewedPostIdRef = useRef(null)

  const loadPost = () => fetchPostById(postId).then(setPost)
  const loadComments = () => fetchComments(postId).then((result) => setComments(result.items))

  // 로그인 상태가 바뀌면 찜 여부가 달라지므로 다시 불러옵니다. 조회 이벤트는 글마다 한 번만 보냅니다.
  useEffect(() => {
    if (post?.id !== postId) setLoading(true)
    setError('')
    Promise.all([loadPost(), loadComments()])
      .then(() => {
        if (viewedPostIdRef.current === postId) return
        viewedPostIdRef.current = postId
        // 조회수 집계 실패는 화면 표시에 영향을 주지 않도록 조용히 넘깁니다.
        recordPostView(postId)
          .then(({ viewCount }) => setPost((p) => (p ? { ...p, viewCount } : p)))
          .catch(() => {})
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, isAuthenticated])

  if (error) {
    return (
      <div>
        <TopBar title="판매글" />
        <EmptyState icon="⚠️" title="판매글을 불러오지 못했어요" description={error} />
      </div>
    )
  }

  if (loading || !post) {
    return (
      <div>
        <TopBar title="판매글" />
        <LoadingSpinner />
      </div>
    )
  }

  const isOwner = currentUser?.id === post.seller?.id
  const isSold = post.status === 'SOLD'

  // 요청 실패 시 메시지를 보여주고, 버전 충돌이면 최신 글을 다시 불러옵니다.
  const handleActionError = (err) => {
    alert(err.message)
    if (err.code === 'VERSION_CONFLICT') loadPost().catch(() => {})
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠어요?')) return
    try {
      await deletePost(post.id, post.version)
      navigate('/mypage', { replace: true })
    } catch (err) {
      handleActionError(err)
    }
  }

  const handleStatusChange = async (status) => {
    if (status === post.status) return
    try {
      const updated = await updatePostStatus(post.id, { status, version: post.version })
      setPost(updated)
    } catch (err) {
      handleActionError(err)
    }
  }

  const toggleFavorite = async () => {
    if (favoritePending) return
    setFavoritePending(true)
    const next = !post.isFavorited
    try {
      await (next ? addFavorite(post.id) : removeFavorite(post.id))
      setPost((p) => ({ ...p, isFavorited: next, favoriteCount: p.favoriteCount + (next ? 1 : -1) }))
    } catch (err) {
      alert(err.message)
    } finally {
      setFavoritePending(false)
    }
  }

  const startChat = async () => {
    try {
      const room = await findOrCreateChatRoom(post.id)
      navigate(`/chats/${room.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddComment = async (content) => {
    try {
      const comment = await createComment(post.id, content)
      setComments((prev) => [...prev, comment])
      return true
    } catch (err) {
      alert(err.message)
      return false
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen pb-28">
      <TopBar
        title="판매글"
        right={
          isOwner && !isSold ? (
            <Button variant="outline" size="sm" fullWidth={false} onClick={() => navigate(`/posts/${post.id}/edit`)}>
              수정
            </Button>
          ) : undefined
        }
      />

      <div className="px-4">
        <ImageSlider images={post.images} className="rounded-3xl" />
      </div>

      <section className="mx-4 mt-3 rounded-3xl bg-canvas p-6">
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />
          {post.category?.name && <span className="text-sm font-semibold text-body">{post.category.name}</span>}
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-ink">{post.title}</h2>
        <p className="mt-2 text-[32px] font-black leading-none tracking-tight text-ink">{formatPrice(post.price)}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-canvas-soft p-3">
            <dt className="text-mute">판매자</dt>
            <dd className="mt-0.5 font-semibold text-ink">{post.seller?.nickname}</dd>
          </div>
          <div className="rounded-2xl bg-canvas-soft p-3">
            <dt className="text-mute">거래 장소</dt>
            <dd className="mt-0.5 font-semibold text-ink">{post.tradePlace?.name}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-mute">
          {formatTimeAgo(post.createdAt)} · 조회 {post.viewCount} · 찜 {post.favoriteCount}
        </p>

        <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-body">{post.description}</p>

        {isOwner && (
          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="mb-2 text-sm font-semibold text-ink">거래 상태</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={isSold}
                  aria-pressed={post.status === opt.value}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    post.status === opt.value ? 'bg-ink text-primary' : 'bg-canvas-soft text-body hover:bg-canvas-soft-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <Button variant="danger" size="sm" fullWidth={false} onClick={handleDelete} className="ml-auto">
                삭제
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="mx-4 mt-3 rounded-3xl bg-canvas p-6">
        <h3 className="text-lg font-semibold text-ink">댓글 {comments.length}</h3>
        <CommentList comments={comments} onDelete={handleDeleteComment} />
        {currentUser ? (
          <CommentInput onSubmit={handleAddComment} />
        ) : (
          <Button variant="secondary" onClick={openLoginModal} className="mt-2">
            로그인하고 댓글 남기기
          </Button>
        )}
      </section>

      {!isOwner && (
        <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-center gap-3 border-t border-ink/10 bg-canvas px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => requireLogin(toggleFavorite)}
            disabled={favoritePending}
            aria-label={post.isFavorited ? '찜 취소' : '찜하기'}
            aria-pressed={post.isFavorited}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink bg-canvas text-ink transition-colors hover:bg-canvas-soft"
          >
            <HeartIcon filled={post.isFavorited} />
          </button>
          <Button onClick={() => requireLogin(startChat)}>채팅하기</Button>
        </div>
      )}
    </div>
  )
}
