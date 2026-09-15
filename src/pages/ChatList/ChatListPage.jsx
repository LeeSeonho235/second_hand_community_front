import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import ChatRoomListItem from '../../components/chat/ChatRoomListItem'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchChatRooms } from '../../api/chat'

export default function ChatListPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChatRooms().then((result) => {
      setRooms(result.items)
      setLoading(false)
    })
  }, [])

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
        rooms.map((room) => <ChatRoomListItem key={room.id} room={room} />)
      )}
    </div>
  )
}
