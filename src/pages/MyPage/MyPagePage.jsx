import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import PostList from '../../components/post/PostList'
import FilterChips from '../../components/post/FilterChips'
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
      navigate('/', { replace: true })
    }
  }

  const filteredPosts = posts.filter((p) => filter === 'all' || p.status === filter)

  return (
    <div className="min-h-screen">
      <PageHeader title="마이페이지" right={null} />

      <section className="mx-4 mt-2 rounded-3xl bg-ink p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-canvas-soft/70">안녕하세요</p>
            <p className="mt-1 truncate text-[36px] font-black leading-[1.05] tracking-tight text-primary">
              {currentUser.nickname}
            </p>
            <p className="mt-2 truncate text-sm text-canvas-soft/70">{currentUser.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-3xl border border-canvas-soft/40 px-4 py-2 text-sm font-semibold text-canvas-soft transition-colors hover:bg-canvas-soft hover:text-ink"
          >
            로그아웃
          </button>
        </div>
        <div className="mt-6 flex gap-6 border-t border-canvas-soft/15 pt-4 text-canvas-soft">
          <div>
            <p className="text-xs text-canvas-soft/70">판매글</p>
            <p className="text-xl font-black">{posts.length}</p>
          </div>
          <div>
            <p className="text-xs text-canvas-soft/70">판매중</p>
            <p className="text-xl font-black">{posts.filter((p) => p.status === 'SELLING').length}</p>
          </div>
          <div>
            <p className="text-xs text-canvas-soft/70">거래완료</p>
            <p className="text-xl font-black">{posts.filter((p) => p.status === 'SOLD').length}</p>
          </div>
        </div>
      </section>

      <h2 className="px-4 pb-1 pt-6 text-2xl font-black tracking-tight text-ink">내 판매글</h2>
      <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

      <div className="pt-2">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState icon="⚠️" title="내 판매글을 불러오지 못했어요" description={error} />
        ) : (
          <PostList posts={filteredPosts} emptyTitle="해당하는 판매글이 없어요" showWishButton={false} />
        )}
      </div>
    </div>
  )
}
