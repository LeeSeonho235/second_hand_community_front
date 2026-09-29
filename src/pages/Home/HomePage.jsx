import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import SearchBar from '../../components/post/SearchBar'
import CategoryFilter from '../../components/post/CategoryFilter'
import PostList from '../../components/post/PostList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { PlusIcon } from '../../components/common/Icons'
import { fetchPosts } from '../../api/posts'
import { useDebounce } from '../../hooks/useDebounce'
import { useRequireLogin } from '../../hooks/useRequireLogin'
import { useAuthStore } from '../../store/useAuthStore'

const Wordmark = () => (
  <span className="flex items-center gap-2">
    <span className="h-3 w-3 rounded-full bg-primary ring-2 ring-ink" aria-hidden="true" />
    캠퍼스마켓
  </span>
)

export default function HomePage() {
  const navigate = useNavigate()
  const requireLogin = useRequireLogin()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState({ nextCursor: null, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const debouncedKeyword = useDebounce(keyword, 300)

  const categoryId = category === 'all' ? undefined : category

  // 로그인 상태가 바뀌면 찜 여부(isFavorited)가 달라지므로 목록을 다시 받습니다.
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    fetchPosts({ q: debouncedKeyword, categoryId })
      .then((result) => {
        if (ignore) return
        setPosts(result.items)
        setPage(result.page)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, category, isAuthenticated])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const result = await fetchPosts({ q: debouncedKeyword, categoryId, cursor: page.nextCursor })
      setPosts((prev) => [...prev, ...result.items])
      setPage(result.page)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <PageHeader title={<Wordmark />} />

      <section className="px-4 pb-4 pt-4">
        <h2 className="text-[44px] font-black leading-[1.02] tracking-tight text-ink">
          남서울대
          <br />
          캠퍼스마켓
        </h2>
        <p className="mt-3 text-base text-body">같은 캠퍼스 학생들과 가깝고 안전하게 사고팔아요.</p>
        <div className="mt-5">
          <SearchBar value={keyword} onChange={setKeyword} />
        </div>
      </section>

      <CategoryFilter value={category} onChange={setCategory} />

      <div className="pt-2">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState icon="⚠️" title="판매글을 불러오지 못했어요" description={error} />
        ) : (
          <>
            <PostList posts={posts} emptyTitle="검색 결과가 없어요" emptyDescription="다른 키워드나 카테고리로 찾아보세요" />
            {page.hasNext && (
              <div className="px-4 pb-4">
                <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? '불러오는 중...' : '더 보기'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 justify-end px-4">
        <button
          onClick={() => requireLogin(() => navigate('/posts/new'))}
          className="pointer-events-auto flex items-center gap-1.5 rounded-3xl bg-primary px-5 py-3 text-base font-semibold text-ink shadow-lg shadow-ink/15 transition-colors hover:bg-primary-active"
        >
          <PlusIcon />
          판매하기
        </button>
      </div>
    </div>
  )
}
