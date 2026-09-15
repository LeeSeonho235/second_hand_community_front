import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuthStore } from '../store/useAuthStore'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isRestoring = useAuthStore((s) => s.isRestoring)
  const restoreSession = useAuthStore((s) => s.restoreSession)
  const location = useLocation()

  useEffect(() => {
    restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isRestoring) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
