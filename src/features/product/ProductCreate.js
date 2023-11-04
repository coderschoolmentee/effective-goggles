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
import { Button, Stack, Typography, MenuItem, Modal, Box } from '@mui/material'
const yupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Product name must contain at least 3 characters')
    .required('Product name is required'),
  price: Yup.number()
    .min(10000, 'Product price must be at least 10,000')
    .required('Product price is required').typeError('Enter number please'),
  category: Yup.string().required('Category is required')
})
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: 'brown',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
}
function ProductCreate ({ handleOpen, handleClose }) {
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
    if (!data.imageLink) {
      data.imageLink = 'https://picsum.photos/200'
    }
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
    <Modal
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <Typography mt={2} variant='h6' gutterBottom component='h1'>
            Create a product
          </Typography>
          <Stack spacing={3}>
            <FTextField
              sx={{ width: '30ch' }}
              name='name'
              label='Product Name'
              placeholder='Name'
            />
            <FTextField
              sx={{ width: '30ch' }}
              type='number'
              name='price'
              label='Price'
              placeholder='Price'
            />
            <FSelect sx={{ width: '30ch' }} label='Select' name='category'>
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
      </Box>
    </Modal>
  )
}
export default ProductCreate
