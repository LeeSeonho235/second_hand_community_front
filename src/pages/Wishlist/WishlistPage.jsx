import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import PostList from '../../components/post/PostList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchMyFavorites } from '../../api/favorites'

export default function WishlistPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMyFavorites().then((result) => {
      setPosts(result.items.map((item) => item.post))
      setLoading(false)
    })
  }, [])

  const handleFavoriteChange = (postId, favorited) => {
    if (!favorited) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="찜 목록" />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <PostList
          posts={posts}
          emptyTitle="찜한 상품이 없어요"
          emptyDescription="마음에 드는 상품을 찜해보세요"
          onFavoriteChange={handleFavoriteChange}
        />
      )}
    </div>
  )
}
