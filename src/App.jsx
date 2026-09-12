import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/Login/LoginPage'
import SignupPage from './pages/Signup/SignupPage'
import HomePage from './pages/Home/HomePage'
import PostDetailPage from './pages/PostDetail/PostDetailPage'
import PostFormPage from './pages/PostForm/PostFormPage'
import ChatListPage from './pages/ChatList/ChatListPage'
import ChatRoomPage from './pages/ChatRoom/ChatRoomPage'
import WishlistPage from './pages/Wishlist/WishlistPage'
import MyPagePage from './pages/MyPage/MyPagePage'

export default function App() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white shadow-sm">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chats" element={<ChatListPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/mypage" element={<MyPagePage />} />
          </Route>

          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:postId/edit" element={<PostFormPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/chats/:roomId" element={<ChatRoomPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
