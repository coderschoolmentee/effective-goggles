import { Typography } from '@mui/material'

function MainFooter () {
  return (
    <Typography variant='body2' color='text.secondary' align='center' p={1}>
      Simple Coffee POS @{new Date().getFullYear()}
    </Typography>
  )
}

export default MainFooter
