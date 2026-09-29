import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import LoginModal from './components/auth/LoginModal'
import LoginPage from './pages/Login/LoginPage'
import SignupPage from './pages/Signup/SignupPage'
import HomePage from './pages/Home/HomePage'
import PostDetailPage from './pages/PostDetail/PostDetailPage'
import PostFormPage from './pages/PostForm/PostFormPage'
import ChatListPage from './pages/ChatList/ChatListPage'
import ChatRoomPage from './pages/ChatRoom/ChatRoomPage'
import WishlistPage from './pages/Wishlist/WishlistPage'
import MyPagePage from './pages/MyPage/MyPagePage'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  // 새로고침 직후 저장된 사용자가 있으면 리프레시 쿠키로 로그인을 복구합니다.
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-canvas-soft sm:border-x sm:border-ink/10">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 홈·판매글 상세는 비로그인도 볼 수 있습니다. */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chats" element={<ChatListPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/mypage" element={<MyPagePage />} />
          </Route>
        </Route>

        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:postId/edit" element={<PostFormPage />} />
          <Route path="/chats/:roomId" element={<ChatRoomPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal />
    </div>
  )
}
