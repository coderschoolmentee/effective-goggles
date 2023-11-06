import { Link, Typography } from '@mui/material'

function MainFooter () {
  return (
    <Typography variant='body2' color='text.secondary' align='center' p={1}>
      <Link color='inherit' href='#'>
        Simple Coffee POS
      </Link>
      {new Date().getFullYear()}
    </Typography>
  )
}

export default MainFooter
