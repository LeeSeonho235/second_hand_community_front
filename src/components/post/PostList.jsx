import PostCard from './PostCard'
import EmptyState from '../common/EmptyState'

export default function PostList({ posts, emptyTitle = '등록된 판매글이 없어요', emptyDescription, onFavoriteChange, showWishButton }) {
  if (posts.length === 0) {
    return <EmptyState icon="🛒" title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="pt-1">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onFavoriteChange={onFavoriteChange} showWishButton={showWishButton} />
      ))}
    </div>
  )
}
