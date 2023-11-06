import { useState } from 'react'
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Container,
  MenuItem,
  Input,
  Typography
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { FormProvider, FSelect, FTextField } from '../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
const RegisterSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
})
const defaultValues = {
  role: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

function RegisterPage () {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  })
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = methods
  const onSubmit = async (data) => {
    const { email, password, role } = data
    try {
      await auth.register({ email, password, role }, () => {
        navigate('/', { replace: true })
      })
    } catch (error) {
      reset()
      setError('responseError', error)
    }
  }

  return password === '123'
    ? (
      <Container maxWidth='xs' mb={4}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {!!errors.responseError && (
              <Alert severity='error'>{errors.responseError.message}</Alert>
            )}
            <Alert severity='info'>
              Already have an account?
              <Link variant='subtitle2' component={RouterLink} to='/login'>
                Sign in
              </Link>
            </Alert>
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
            <FTextField
              name='passwordConfirmation'
              label='Password Confirmation'
              type={showPasswordConfirmation ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() =>
                        setShowPasswordConfirmation(!showPasswordConfirmation)}
                      edge='end'
                    >
                      {showPasswordConfirmation
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
            <FSelect name='role' label='Role'>
              {['admin', 'staff'].map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </FSelect>

            <LoadingButton
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              loading={isSubmitting}
            >
              Register
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
      )
    : (
      <Stack spacing={3}>
        <Typography variant='h6' component='h1' gutterBottom>
          Enter password
        </Typography>

        <Input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link variant='subtitle2' component={RouterLink} to='/'>
          Go back to home
        </Link>
      </Stack>
      )
}
export default RegisterPage
