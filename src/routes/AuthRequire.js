import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'
import NotFoundPage from '../pages/NotFoundPage'
import { Box } from '@mui/material'

function AuthRequire ({ children }) {
  const { isInitialized, isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isInitialized) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <LoadingScreen />
      </Box>
    )
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
