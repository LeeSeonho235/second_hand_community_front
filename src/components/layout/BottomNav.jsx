import { NavLink } from 'react-router-dom'
import { ChatIcon, HeartIcon, HomeIcon, UserIcon } from '../common/Icons'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: HomeIcon, end: true },
  { to: '/chats', label: '채팅', icon: ChatIcon },
  { to: '/wishlist', label: '찜', icon: HeartIcon },
  { to: '/mypage', label: '마이페이지', icon: UserIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 border-t border-ink/10 bg-canvas px-2 pb-[env(safe-area-inset-bottom)]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2 text-xs ${isActive ? 'font-semibold text-ink' : 'text-mute'}`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`flex h-8 w-14 items-center justify-center rounded-full ${isActive ? 'bg-primary' : ''}`}>
                <item.icon />
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
