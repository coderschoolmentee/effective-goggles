import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { Divider } from '@mui/material'

const pages = [
  { name: 'Categories', link: '/categories' },
  { name: 'Products', link: '/products' },
  { name: 'Orders', link: '/orders' },
  { name: 'Stats', link: '/stats' }
]

const settings = [
  { name: 'Home', link: '/' },
  { name: 'Account', link: '/account' },
  { name: 'Logout' }
]

function ResponsiveAppBar () {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      handleCloseNavMenu()
      await logout(() => {
        navigate('/login')
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            <PointOfSaleIcon
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) =>
                !isAdmin &&
                (page.name === 'Categories' ||
                  page.name === 'Stats' ||
                  page.name === 'Products')
                  ? null
                  : (
                    <MenuItem
                      key={page.name}
                      onClick={handleCloseNavMenu}
                      component={RouterLink}
                      to={page.link}
                    >
                      <Typography textAlign='center'>{page.name}</Typography>
                    </MenuItem>
                    )
              )}
            </Menu>
          </Box>
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            <PointOfSaleIcon
              sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) =>
              !isAdmin &&
              (page.name === 'Categories' ||
                page.name === 'Stats' ||
                page.name === 'Products' ||
                page.name === 'Customers')
                ? null
                : (
                  <Button
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    component={RouterLink}
                    to={page.link}
                  >
                    {page.name}
                  </Button>
                  )
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Avatar' src={user.avatarUrl} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography
                  variant='body1'
                  sx={{ color: 'text.secondary' }}
                  noWrap
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: 'text.secondary' }}
                  noWrap
                >
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ borderStyle: 'dashed' }} />

              {settings.map((setting) =>
                setting.name === 'Logout'
                  ? (
                    <MenuItem key={setting.name} onClick={handleLogout}>
                      <Typography textAlign='center'>{setting.name}</Typography>
                    </MenuItem>
                    )
                  : (
                    <MenuItem
                      key={setting.name}
                      onClick={handleCloseUserMenu}
                      component={RouterLink}
                      to={setting.link}
                    >
                      <Typography textAlign='center'>{setting.name}</Typography>
                    </MenuItem>
                    )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar
