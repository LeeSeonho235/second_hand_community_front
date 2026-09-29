import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import PostList from '../../components/post/PostList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { fetchMyFavorites } from '../../api/favorites'

export default function WishlistPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchMyFavorites()
      .then((result) => setPosts(result.items.map((item) => item.post)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleFavoriteChange = (postId, favorited) => {
    if (!favorited) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="찜 목록" />
      <div className="pt-2">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState icon="⚠️" title="찜 목록을 불러오지 못했어요" description={error} />
        ) : (
          <PostList
            posts={posts}
            emptyTitle="찜한 상품이 없어요"
            emptyDescription="마음에 드는 상품을 찜해보세요"
            onFavoriteChange={handleFavoriteChange}
          />
        )}
      </div>
    </div>
  )
}
