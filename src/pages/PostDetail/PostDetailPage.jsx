import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import ImageSlider from '../../components/post/ImageSlider'
import StatusBadge, { STATUS_OPTIONS } from '../../components/post/StatusBadge'
import CommentList from '../../components/comment/CommentList'
import CommentInput from '../../components/comment/CommentInput'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchPostById, deletePost, updatePostStatus } from '../../api/posts'
import { fetchComments, createComment, deleteComment } from '../../api/comments'
import { findOrCreateChatRoom } from '../../api/chat'
import { formatPrice, formatTimeAgo } from '../../utils/format'
import { getCategoryLabel } from '../../mocks/categories'
import { getLocationLabel } from '../../mocks/locations'
import { findUserById } from '../../mocks/users'
import { useAuthStore } from '../../store/useAuthStore'
import { useWishlistStore } from '../../store/useWishlistStore'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const isWished = useWishlistStore((s) => s.isWished(postId))
  const toggleWish = useWishlistStore((s) => s.toggle)

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPost = () => fetchPostById(postId).then(setPost)
  const loadComments = () => fetchComments(postId).then(setComments)

  useEffect(() => {
    setLoading(true)
    Promise.all([loadPost(), loadComments()]).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  if (loading || !post) {
    return (
      <div>
        <TopBar title="판매글" />
        <LoadingSpinner />
      </div>
    )
  }

  const isOwner = currentUser?.id === post.sellerId
  const seller = findUserById(post.sellerId)

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠어요?')) return
    await deletePost(post.id)
    navigate('/mypage', { replace: true })
  }

  const handleStatusChange = async (status) => {
    const updated = await updatePostStatus(post.id, status)
    setPost(updated)
  }

  const handleChat = async () => {
    const room = await findOrCreateChatRoom({
      postId: post.id,
      buyerId: currentUser.id,
      sellerId: post.sellerId,
    })
    navigate(`/chats/${room.id}`)
  }

  const handleAddComment = async (content) => {
    const comment = await createComment({ postId: post.id, authorId: currentUser.id, content })
    setComments((prev) => [...prev, comment])
  }

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <TopBar
        title="판매글"
        right={
          isOwner ? (
            <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="text-sm text-gray-500">
              수정
            </button>
          ) : null
        }
      />

      <ImageSlider images={post.images} />

      <div className="px-4 py-4">
        <p className="text-xs font-medium text-brand-500">{getCategoryLabel(post.category)}</p>
        <h1 className="mt-1 text-lg font-bold text-gray-900">{post.title}</h1>
        <p className="mt-1 text-xs text-gray-400">
          {seller?.nickname} · {getLocationLabel(post.location)} · {formatTimeAgo(post.createdAt)} · 조회{' '}
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
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
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
            onClick={() => toggleWish(post.id)}
            aria-label="찜하기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-xl"
          >
            {isWished ? '❤️' : '🤍'}
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
