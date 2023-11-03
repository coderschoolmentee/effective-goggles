import { Outlet } from 'react-router-dom'
import { Box, Stack } from '@mui/material'
import MainFooter from './MainFooter'
import ResponsiveAppBar from './ResponsiveAppBar'
import AlertMsg from '../components/AlertMsg'

function MainLayout () {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <AlertMsg />
      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      <MainFooter />
    </Stack>
  )
}

export default MainLayout
