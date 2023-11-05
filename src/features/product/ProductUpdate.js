import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField, FUploadImage, FSelect } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { updateProduct } from './productSlice'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Modal, Stack, Typography, MenuItem } from '@mui/material'
import { getCategories } from '../category/categorySlice'
import DeleteIcon from '@mui/icons-material/Delete'
import AlertDialog from './ProductDelete'
const yupSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Category name must contain at least 3 characters').required('Product name is required')
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
function ProductUpdate ({
  handleOpen,
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
      if (file && file !== productImage) {
        setValue(
          'imageLink',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      }
    },
    [setValue, productImage]
  )
  const isFormChanged = (formData) => {
    return (
      formData.name !== productName ||
      formData.price !== productPrice ||
      formData.imageLink !== productImage ||
      formData.category !== productCategory
    )
  }
  const onSubmit = async (data) => {
    const formData = {
      id: productId,
      name: data.name,
      price: data.price,
      category: data.category,
      imageLink: data.imageLink
    }
    if (isFormChanged(formData)) {
      const isImageChanged = data.imageLink !== productImage
      if (isImageChanged) {
        dispatch(updateProduct({ ...formData })).then(() => reset())
      } else {
        dispatch(updateProduct({ id: productId, name: data.name, price: data.price, category: data.category })).then(() => reset())
      }
      handleClose()
    } else {
      handleClose()
    }
  }
  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategories())
    }
  }, [categories, dispatch])
  useEffect(() => {
    setValue('name', productName)
    setValue('price', productPrice)
    setValue('imageLink', productImage)
    setValue('category', productCategory)
  }, [productName, productPrice, productImage, productCategory, setValue])
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
            Update product details
          </Typography>
          <Stack spacing={3}>
            <FTextField
              sx={{ width: '30ch' }}
              name='name'
              label='Product Name'
              placeholder='New name'
            />
            <FTextField
              type='number'
              sx={{ width: '30ch' }}
              name='price'
              label='Product Price'
              placeholder='New Price'
            />
            <FSelect sx={{ width: '30ch' }} label='Select' name='category'>
              {categories.map((option) => (
                <MenuItem key={option._id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </FSelect>
            <FUploadImage
              sx={{ width: '20ch', zIndex: '2' }}
              name='imageLink'
              maxSize={3145728}
              onDrop={handleDrop}
            />
            <Stack direction='row' spacing={2} alignItems='center'>
              <Button onClick={openDeleteDialog}>
                <DeleteIcon color='warning' />
              </Button>
              <AlertDialog
                isOpen={isDeleteDialogOpen}
                handleCloseDialog={closeDeleteDialog}
                productId={productId}
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
      </Box>
    </Modal>
  )
}
export default ProductUpdate
