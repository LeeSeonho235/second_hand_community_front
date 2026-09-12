import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import PostList from '../../components/post/PostList'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchPostsByIds } from '../../api/posts'
import { useWishlistStore } from '../../store/useWishlistStore'

export default function WishlistPage() {
  const postIds = useWishlistStore((s) => s.postIds)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPostsByIds(postIds).then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [postIds])

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
        />
      )}
    </div>
  )
}
