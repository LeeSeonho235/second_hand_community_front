import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import PostCard from '../../components/post/PostCard'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchPostsBySeller } from '../../api/posts'
import { useAuthStore } from '../../store/useAuthStore'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'SELLING', label: '판매중' },
  { value: 'RESERVED', label: '예약중' },
  { value: 'SOLD', label: '거래완료' },
]

export default function MyPagePage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPostsBySeller(currentUser.id)
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [currentUser.id])

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  const filteredPosts = posts.filter((p) => filter === 'all' || p.status === filter)

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="마이페이지" />

      <div className="flex items-center gap-3 border-b-8 border-gray-50 px-4 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-500">
          {currentUser.nickname?.[0] ?? '?'}
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-gray-900">{currentUser.nickname}</p>
          <p className="text-xs text-gray-400">{currentUser.email}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-400 underline">
          로그아웃
        </button>
      </div>

      <div className="px-4 pt-4">
        <p className="mb-2 text-sm font-semibold text-gray-800">내 판매글</p>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filter === f.value ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <EmptyState icon="⚠️" title="내 판매글을 불러오지 못했어요" description={error} />
      ) : filteredPosts.length === 0 ? (
        <EmptyState icon="📦" title="해당하는 판매글이 없어요" />
      ) : (
        <div className="mt-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} showWishButton={false} />
          ))}
        </div>
      )}
    </div>
  )
}
