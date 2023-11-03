import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { createCategory, getCategories } from './categorySlice'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
const yupSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required')
})

function CategoryCreate ({ handleClose }) {
  const { isLoading } = useSelector(state => state.category)
  const dispatch = useDispatch()
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })
  const { handleSubmit, reset } = methods

  const onSubmit = async data => {
    dispatch(createCategory(data)).then(() => reset())
    handleClose()
    getCategories()
  }

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Create a category
      </Typography>
      <Stack spacing={3}>
        <FTextField
          sx={{ width: '50ch' }}
          name='name'
          label='Category Name'
          // fullWidth
          placeholder='Name'
        />
        <FTextField
          sx={{ width: '50ch' }}
          name='description'
          label='Description'
          // fullWidth
          placeholder='Description'
        />
        <Stack direction='row' spacing={2}>
          <LoadingButton type='submit' variant='contained' loading={isLoading}>
            Save
          </LoadingButton>
          <Button onClick={handleClose} variant='contained'>Cancel</Button>
        </Stack>

      </Stack>
    </FormProvider>
  )
}

export default CategoryCreate
