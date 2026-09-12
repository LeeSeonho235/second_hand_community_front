import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: '🏠', end: true },
  { to: '/chats', label: '채팅', icon: '💬' },
  { to: '/wishlist', label: '찜', icon: '❤️' },
  { to: '/mypage', label: '마이페이지', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
              isActive ? 'text-brand-500' : 'text-gray-400'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
