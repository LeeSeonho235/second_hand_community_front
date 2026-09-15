import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import SearchBar from '../../components/post/SearchBar'
import CategoryFilter from '../../components/post/CategoryFilter'
import PostList from '../../components/post/PostList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchPosts } from '../../api/posts'
import { useDebounce } from '../../hooks/useDebounce'

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState({ nextCursor: null, hasNext: false })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const debouncedKeyword = useDebounce(keyword, 300)

  const categoryId = category === 'all' ? undefined : category

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetchPosts({ q: debouncedKeyword, categoryId }).then((result) => {
      if (!ignore) {
        setPosts(result.items)
        setPage(result.page)
        setLoading(false)
      }
    })
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword, category])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    try {
      const result = await fetchPosts({ q: debouncedKeyword, categoryId, cursor: page.nextCursor })
      setPosts((prev) => [...prev, ...result.items])
      setPage(result.page)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white">
      <PageHeader title="캠퍼스마켓" />
      <div className="px-4 pt-3">
        <SearchBar value={keyword} onChange={setKeyword} />
      </div>
      <CategoryFilter value={category} onChange={setCategory} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PostList
            posts={posts}
            emptyTitle="검색 결과가 없어요"
            emptyDescription="다른 키워드나 카테고리로 찾아보세요"
          />
          {page.hasNext && (
            <div className="px-4 py-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600"
              >
                {loadingMore ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => navigate('/posts/new')}
        aria-label="판매글 등록"
        className="fixed bottom-20 left-1/2 z-20 ml-[152px] flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-2xl text-white shadow-lg"
      >
        +
      </button>
    </div>
  )
}
