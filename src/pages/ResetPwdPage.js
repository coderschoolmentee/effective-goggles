import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Container, Stack, Link, Alert, Typography, IconButton,
  InputAdornment
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FormProvider, FTextField } from '../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
import {
  sendPassWordResetToken,
  resetPassword
} from '../features/user/userSlice'
const ResetPwdSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email yup').required('Email is required'),
  newPassword: Yup.string(),
  newPasswordConfirmation: Yup.string().oneOf(
    [Yup.ref('newPassword')],
    'Passwords must match')
})
const defaultValues = {
  email: '',
  token: '',
  newPassword: '',
  newPasswordConfirmation: ''
}
function ResetPwdPage () {
  const navigate = useNavigate()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [step, setStep] = useState(1)
  const dispatch = useDispatch()
  const methods = useForm({
    resolver: yupResolver(ResetPwdSchema),
    defaultValues
  })
  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = methods
  const onSubmitEmail = async (data) => {
    try {
      console.log('data onSubmitEmail', data)
      dispatch(sendPassWordResetToken(data.email))
      setStep(2)
      setValue('email', data.email)
    } catch (error) {
      console.log('error onSubmitEmail', error)
      reset()
      setErrorMessage(error.error || 'Unknown error')
    }
  }
  const onSubmit = async (data) => {
    try {
      console.log('data at onSubmit', data)
      dispatch(resetPassword(data.email, data.token, data.newPassword))
      if (!data.token) {
        setErrorMessage('token required')
        return
      }
      if (!data.newPassword) {
        setErrorMessage('new password required')
        return
      }
      reset()
      // navigate('/login')
    } catch (error) {
      console.log('error', error)
      reset()
      setError('responseError', error)
      setStep(2)
    }
  }
  return (
    <Container maxWidth='xs'>
      <FormProvider
        methods={methods}
        onSubmit={
          step === 1 ? handleSubmit(onSubmitEmail) : handleSubmit(onSubmit)
        }
      >
        <Stack spacing={3} sx={{ mb: 2 }}>
          {errors.responseError && (
            <Alert severity='error'>{errors.responseError.error}</Alert>
          )}
          <Typography variant='h6'>Reset Password</Typography>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          {step === 1 && (
            <>
              <FTextField name='email' label='Email address' />
              <LoadingButton
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                loading={isSubmitting}
              >
                Send Reset Email
              </LoadingButton>
            </>
          )}
          {step === 2 && (
            <>
              <FTextField name='token' label='Reset Token' />
              <FTextField
                name='newPassword'
                label='New Password'
                type={showNewPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge='end'
                      >
                        {showNewPassword
                          ? (
                            <VisibilityIcon />
                            )
                          : (
                            <VisibilityOffIcon />
                            )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FTextField
                name='newPasswordConfirmation'
                label='Confirm New Password'
                type={showNewPasswordConfirm ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() =>
                          setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                        edge='end'
                      >
                        {showNewPasswordConfirm
                          ? (
                            <VisibilityIcon />
                            )
                          : (
                            <VisibilityOffIcon />
                            )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <LoadingButton
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                loading={isSubmitting}
              >
                Reset Password
              </LoadingButton>
            </>
          )}
        </Stack>
        <Stack
          direction='row'
          gap={2}
          alignItems='center'
          justifyContent='center'
          sx={{ my: 2 }}
        >
          {step === 2 && (
            <Link variant='subtitle2' onClick={() => setStep(1)}>
              Back to Email
            </Link>
          )}
          <Link variant='subtitle2' component={RouterLink} to='/login'>
            Back to Login
          </Link>
        </Stack>
      </FormProvider>
    </Container>
  )
}
export default ResetPwdPage
