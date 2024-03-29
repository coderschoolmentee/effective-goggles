import { useState } from 'react'
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Container
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { FormProvider, FTextField } from '../components/form'
import useAuth from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
})
const defaultValues = {
  email: '',
  password: ''
}
function LoginPage () {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  })
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    const from = location.state?.from?.pathname || '/'
    const { email, password } = data
    try {
      await auth.login({ email, password }, () => {
        navigate(from, { replace: true })
      })
    } catch (error) {
      console.log('error', error)
      reset()
      setError('responseError', error)
    }
  }

  return (
    <Container maxWidth='xs'>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {errors.responseError && (
            <Alert severity='error'>{errors.responseError.error}</Alert>
          )}
          <FTextField name='email' label='Email address' />
          <FTextField
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge='end'
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Stack
          direction='row'
          gap={2}
          alignItems='center'
          justifyContent='center'
          sx={{ my: 2 }}
        >
          <Link variant='subtitle2' component={RouterLink} to='/register'>
            Register
          </Link>

          <Link component={RouterLink} variant='subtitle2' to='/reset'>
            Reset password
          </Link>
        </Stack>
      </FormProvider>
    </Container>
  )
}
export default LoginPage
