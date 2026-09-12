import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import ChatRoomListItem from '../../components/chat/ChatRoomListItem'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchChatRooms } from '../../api/chat'
import { fetchPostsByIds } from '../../api/posts'
import { findUserById } from '../../mocks/users'
import { useAuthStore } from '../../store/useAuthStore'

export default function ChatListPage() {
  const currentUser = useAuthStore((s) => s.user)
  const [rooms, setRooms] = useState([])
  const [postsById, setPostsById] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChatRooms(currentUser.id).then(async (roomList) => {
      const posts = await fetchPostsByIds(roomList.map((r) => r.postId))
      setPostsById(Object.fromEntries(posts.map((p) => [p.id, p])))
      setRooms(roomList)
      setLoading(false)
    })
  }, [currentUser.id])

  if (loading) {
    return (
      <div>
        <PageHeader title="채팅" />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="채팅" />
      {rooms.length === 0 ? (
        <EmptyState icon="💬" title="채팅 내역이 없어요" description="판매글에서 채팅을 시작해보세요" />
      ) : (
        rooms.map((room) => {
          const partnerId = room.buyerId === currentUser.id ? room.sellerId : room.buyerId
          return (
            <ChatRoomListItem
              key={room.id}
              room={room}
              partner={findUserById(partnerId)}
              post={postsById[room.postId]}
            />
          )
        })
      )}
    </div>
  )
}
