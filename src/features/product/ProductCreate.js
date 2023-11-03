import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FormProvider,
  FSelect,
  FTextField,
  FUploadImage
} from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { createProduct, getProducts } from './productSlice'
import { getCategories } from '../category/categorySlice'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography, MenuItem } from '@mui/material'
const yupSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required')
})

function ProductCreate ({ handleClose }) {
  const { isLoading } = useSelector(state => state.product)
  const { categories } = useSelector(state => state.category)
  const dispatch = useDispatch()
  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      imageLink: null
    }
  })
  const { handleSubmit, setValue, reset } = methods

  const onSubmit = async data => {
    dispatch(createProduct(data)).then(() => reset())
    handleClose()
    getProducts()
  }

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  const handleDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]
      if (file) {
        setValue(
          'imageLink',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      }
    },
    [setValue]
  )

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Create a product
      </Typography>
      <Stack spacing={3}>
        <FTextField
          sx={{ width: '50ch' }}
          name='name'
          label='Product Name'
          placeholder='Name'
        />
        <FTextField
          sx={{ width: '50ch' }}
          type='number'
          name='price'
          label='Price'
          placeholder='Price'
        />
        <FSelect sx={{ width: '50ch' }} label='Select' name='category'>
          {categories.map(option => (
            <MenuItem key={option._id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </FSelect>
        <FUploadImage
          sx={{ width: '20ch' }}
          name='imageLink'
          accept='image/*'
          maxSize={3145728}
          onDrop={handleDrop}
        />
        <Stack direction='row' spacing={2}>
          <LoadingButton type='submit' variant='contained' loading={isLoading}>
            Save
          </LoadingButton>
          <Button onClick={handleClose} variant='contained'>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default ProductCreate
