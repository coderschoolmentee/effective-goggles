import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import apiService from '../app/apiService'
import { Typography, Link, Stack } from '@mui/material'
const VerifyEmailPage = () => {
  const { token } = useParams()
  const [verificationStatus, setVerificationStatus] = useState(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await apiService.get(`users/verify/${token}`)
        setVerificationStatus('success')
      } catch (error) {
        console.error('Error verifying email:', error.message)
        setVerificationStatus('error')
      }
    }
    verifyEmail()
  }, [token])

  return (
    <>
      {verificationStatus === 'success' && (
        <Stack spacing={3} minHeight='100vh' justifyContent='center' alignItems='center'>
          <Typography variant='body1' color='textPrimary'>
            Email verified successfully!
          </Typography>
          <Link variant='subtitle2' component={RouterLink} to='/login'>
            Sign in
          </Link>
        </Stack>
      )}
      {verificationStatus === 'error' && (
        <Stack minHeight='100vh' justifyContent='center' alignItems='center'>
          <Typography variant='body1' sx={{ color: 'error.main' }}>
            There was an error verifying the email. Please try again.
          </Typography>
        </Stack>
      )}
      {verificationStatus === null && (
        <Typography variant='body1' color='textSecondary'>
          Verifying email...
        </Typography>
        // <LoadingScreen />
      )}
    </>
  )
}

export default VerifyEmailPage
