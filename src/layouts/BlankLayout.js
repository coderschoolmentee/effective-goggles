import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
import { Stack } from '@mui/material'
import AlertMsg from '../components/AlertMsg'
function BlankLayout () {
  return (
    <Stack minHeight='100vh' margin={2} justifyContent='center' alignItems='center'>
      <AlertMsg />
      <Logo sx={{ width: 90, height: 90, mb: 5 }} />
      <Outlet />
    </Stack>
  )
}
export default BlankLayout
