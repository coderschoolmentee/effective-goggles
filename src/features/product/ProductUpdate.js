import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField, FUploadImage, FSelect } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { updateProduct, getProducts } from './productSlice'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography, MenuItem } from '@mui/material'
import { getCategories } from '../category/categorySlice'
import DeleteIcon from '@mui/icons-material/Delete'
import AlertDialog from './ProductDelete'
const yupSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required')
})

function ProductUpdate ({
  handleClose,
  productId,
  productName,
  productPrice,
  productImage,
  productCategory
}) {
  const { isLoading } = useSelector((state) => state.product)
  const { categories } = useSelector(state => state.category)
  const dispatch = useDispatch()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    handleClose()
  }

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      name: productName,
      price: productPrice,
      imageLink: productImage,
      category: productCategory
    }
  })
  const { handleSubmit, reset, setValue } = methods

  const handleDrop = useCallback(
    (acceptedFiles) => {
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
  const onSubmit = async (data) => {
    dispatch(updateProduct({ id: productId, ...data })).then(() => reset())
    handleClose()
    getProducts()
  }

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  useEffect(() => {
    setValue('name', productName)
    setValue('price', productPrice)
    setValue('imageLink', productImage)
    setValue('category', productCategory)
  }, [productName, productPrice, productImage, productCategory, setValue])

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Update product details
      </Typography>
      <Stack spacing={3}>
        <FTextField
          sx={{ width: '50ch' }}
          name='name'
          label='Product Name'
          placeholder='New name'
        />
        <FTextField
          type='number'
          sx={{ width: '50ch' }}
          name='price'
          label='Product Price'
          placeholder='New Price'
        />
        <FSelect sx={{ width: '50ch' }} label='Select' name='category'>
          {categories.map((option) => (
            <MenuItem key={option._id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </FSelect>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Button onClick={openDeleteDialog}>
            <DeleteIcon color='warning' />
          </Button>
          <AlertDialog
            isOpen={isDeleteDialogOpen}
            handleCloseDialog={closeDeleteDialog}
            productId={productId}
          />
          <FUploadImage
            sx={{ width: '20ch', zIndex: '2' }}
            name='imageLink'
            // accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <LoadingButton type='submit' variant='contained' loading={isLoading}>
            Update
          </LoadingButton>
          <Button onClick={handleClose} variant='contained'>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default ProductUpdate
