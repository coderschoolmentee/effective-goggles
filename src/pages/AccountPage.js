import { useCallback, useState, useEffect } from 'react'
import {
  Stack,
  Container,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import useAuth from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { FormProvider, FTextField, FUploadImage } from '../components/form'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../features/user/userSlice'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
const updatePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string(),
  newPassword: Yup.string(),
  newPasswordConfirmation: Yup.string().oneOf(
    [Yup.ref('newPassword')],
    'Passwords must match'
  )
})
function AccountPage () {
  const updatedProfile = useSelector((state) => state.user.updatedProfile)
  const [tabValue, setTabValue] = useState('1')
  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { user } = useAuth()
  const isLoading = useSelector((state) => state.user.isLoading)

  const defaultValues = {
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  }
  const methods = useForm({
    resolver: yupResolver(updatePasswordSchema),
    defaultValues
  })
  const {
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting }
  } = methods
  const dispatch = useDispatch()
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      }
    },
    [setValue]
  )
  useEffect(() => {
    if (updatedProfile) {
      setValue('avatarUrl', updatedProfile.avatarUrl || '')
    }
  }, [updatedProfile, setValue])

  const onSubmit = async (data) => {
    try {
      if (
        (data.oldPassword && !data.newPassword) ||
        (data.newPassword && !data.oldPassword)
      ) {
        setErrorMessage('Please enter both old and new passwords')
        return
      }

      if (JSON.stringify(data) === JSON.stringify(defaultValues)) {
        return
      }

      dispatch(updateUserProfile({ userId: user._id, ...data }))
      reset()
      setErrorMessage('')
    } catch (error) {
      console.log('errr', error)
      setError('responseError', error)
    }
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'
              >
                <Tab label='Profile picture' value='1' />
                <Tab label='Change password' value='2' />
              </TabList>
            </Box>
            <TabPanel sx={{ pl: 0 }} value='1'>
              <FUploadImage
                sx={{ width: '25ch' }}
                name='avatarUrl'
                accept='image/*'
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </TabPanel>
            <TabPanel sx={{ pl: 0 }} value='2'>
              <Stack spacing={2}>
                <FTextField
                  sx={{ width: '25ch' }}
                  name='oldPassword'
                  label='Old Password'
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge='end'
                        >
                          {showPassword
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
                {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
                <FTextField
                  sx={{ width: '25ch' }}
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
                  sx={{ width: '25ch' }}
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
              </Stack>
            </TabPanel>
          </TabContext>
          <Stack direction='row' spacing={2}>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={isSubmitting || isLoading}
            >
              Save Changes
            </LoadingButton>
            <LoadingButton
              variant='contained'
              onClick={() => {
                reset(defaultValues)
                setErrorMessage('')
              }}
            >
              Cancel
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </Container>
  )
}
export default AccountPage
