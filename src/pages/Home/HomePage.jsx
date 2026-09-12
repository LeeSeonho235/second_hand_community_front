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
  const [loading, setLoading] = useState(true)
  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    fetchPosts({ keyword: debouncedKeyword, category }).then((data) => {
      if (!ignore) {
        setPosts(data)
        setLoading(false)
      }
    })
    return () => {
      ignore = true
    }
  }, [debouncedKeyword, category])

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
        <PostList
          posts={posts}
          emptyTitle="검색 결과가 없어요"
          emptyDescription="다른 키워드나 카테고리로 찾아보세요"
        />
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
