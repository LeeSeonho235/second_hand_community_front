import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import ChatRoomListItem from '../../components/chat/ChatRoomListItem'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { fetchChatRooms } from '../../api/chat'

export default function ChatListPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChatRooms()
      .then((result) => setRooms(result.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <PageHeader title="채팅" />
      <div className="pt-2">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState icon="⚠️" title="채팅 목록을 불러오지 못했어요" description={error} />
        ) : rooms.length === 0 ? (
          <EmptyState icon="💬" title="채팅 내역이 없어요" description="판매글에서 채팅을 시작해보세요" />
        ) : (
          rooms.map((room) => <ChatRoomListItem key={room.id} room={room} />)
        )}
      </div>
    </div>
  )
}
