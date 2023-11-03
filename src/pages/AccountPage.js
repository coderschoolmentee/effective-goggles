import { useCallback } from 'react'
import { Stack, Container } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import useAuth from '../hooks/useAuth'
import { useForm } from 'react-hook-form'

import { FormProvider, FTextField, FUploadImage } from '../components/form'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../features/user/userSlice'

function AccountPage () {
  const { user } = useAuth()
  const isLoading = useSelector((state) => state.user.isLoading)
  const defaultValues = {
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || ''
  }
  const methods = useForm({
    defaultValues
  })
  const {
    setValue,
    handleSubmit,
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

  const onSubmit = (data) => {
    dispatch(updateUserProfile({ userId: user._id, ...data }))
  }
  return (
    <Container sx={{ mt: 2 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <FUploadImage
            sx={{ width: '20ch' }}
            name='avatarUrl'
            accept='image/*'
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <FTextField sx={{ width: '20ch' }} name='email' label='Email' disabled />

          <Stack direction='row' spacing={2}>
            <LoadingButton
              type='submit'
              variant='contained'
              loading={isSubmitting || isLoading}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Container>
  )
}

export default AccountPage
