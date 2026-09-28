import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ImageSlider from '../../components/post/ImageSlider'
import StatusBadge, { STATUS_OPTIONS } from '../../components/post/StatusBadge'
import CommentList from '../../components/comment/CommentList'
import CommentInput from '../../components/comment/CommentInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { fetchPostById, deletePost, updatePostStatus, recordPostView } from '../../api/posts'
import { fetchComments, createComment, deleteComment } from '../../api/comments'
import { addFavorite, removeFavorite } from '../../api/favorites'
import { findOrCreateChatRoom } from '../../api/chat'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { useAuthStore } from '../../store/useAuthStore'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [favoritePending, setFavoritePending] = useState(false)
  const [error, setError] = useState('')

  const loadPost = () => fetchPostById(postId).then(setPost)
  const loadComments = () => fetchComments(postId).then((result) => setComments(result.items))

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([loadPost(), loadComments()])
      .then(() => {
        // 조회수 집계 실패는 화면 표시에 영향을 주지 않도록 조용히 넘깁니다.
        recordPostView(postId)
          .then(({ viewCount }) => setPost((p) => (p ? { ...p, viewCount } : p)))
          .catch(() => {})
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

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

  const handleToggleFavorite = async () => {
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

  const handleChat = async () => {
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
    } catch (err) {
      alert(err.message)
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
    <div className="min-h-screen bg-white pb-20">
      <TopBar
        title="판매글"
        right={
          isOwner && !isSold ? (
            <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="text-sm text-gray-500">
              수정
            </button>
          ) : null
        }
      />

      <ImageSlider images={post.images} />

      <div className="px-4 py-4">
        <p className="text-xs font-medium text-brand-500">{post.category?.name}</p>
        <h1 className="mt-1 text-lg font-bold text-gray-900">{post.title}</h1>
        <p className="mt-1 text-xs text-gray-400">
          {post.seller?.nickname} · {post.tradePlace?.name} · {formatTimeAgo(post.createdAt)} · 조회{' '}
          {post.viewCount}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <StatusBadge status={post.status} />
          <p className="text-xl font-bold text-gray-900">{formatPrice(post.price)}</p>
        </div>

        {isOwner && (
          <div className="mt-3 flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                disabled={isSold}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium disabled:opacity-40 ${
                  post.status === opt.value
                    ? 'border-brand-500 bg-brand-50 text-brand-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button onClick={handleDelete} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500">
              삭제
            </button>
          </div>
        )}

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{post.description}</p>
      </div>

      <div className="border-t-8 border-gray-50" />

      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-800">댓글 {comments.length}</p>
      </div>
      <CommentList comments={comments} onDelete={handleDeleteComment} />
      {currentUser && <div className="pb-2"><CommentInput onSubmit={handleAddComment} /></div>}

      {!isOwner && (
        <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-center gap-3 border-t border-gray-100 bg-white px-4 py-3">
          <button
            onClick={handleToggleFavorite}
            disabled={favoritePending}
            aria-label="찜하기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-xl"
          >
            {post.isFavorited ? '❤️' : '🤍'}
          </button>
          <button
            onClick={handleChat}
            className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white"
          >
            채팅하기
          </button>
        </div>
      )}
    </div>
  )
}
