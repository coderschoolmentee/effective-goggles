import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'
import NotFoundPage from '../pages/NotFoundPage'

function AuthRequire ({ children }) {
  const { isInitialized, isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isInitialized) {
    return <LoadingScreen />
  }
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  if (user?.role !== 'admin') {
    const notAllowedPages = ['/categories', '/stats', '/products']
    if (notAllowedPages.includes(location.pathname)) {
      return <NotFoundPage />
    }
  }

  return children
}
export default AuthRequire
