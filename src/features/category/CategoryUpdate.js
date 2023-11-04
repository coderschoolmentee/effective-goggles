import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { updateCategory, getCategories } from './categorySlice'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Modal, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AlertDialog from './CategoryDelete'
const yupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Category name must contain at least 3 characters')
    .required('Category name is required'),
  description: Yup.string()
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

function CategoryUpdate ({ handleOpen, handleClose, categoryId, categoryName, categoryDescription }) {
  const { isLoading } = useSelector(state => state.category)
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
      name: categoryName,
      description: categoryDescription
    }
  })
  const { handleSubmit, reset, setValue } = methods

  const onSubmit = async data => {
    dispatch(updateCategory({ id: categoryId, ...data })).then(() => reset())
    handleClose()
    getCategories()
  }
  useEffect(() => {
    setValue('name', categoryName)
    setValue('description', categoryDescription)
  }, [categoryName, categoryDescription, setValue])

  return (
    <Modal
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <Typography mb={2} variant='h6' gutterBottom component='h1'>
            Update category name
          </Typography>
          <Stack spacing={3}>
            <FTextField
              sx={{ width: '30ch' }}
              name='name'
              label='Category Name'
              placeholder='New name'
            />
            <FTextField
              sx={{ width: '30ch' }}
              name='description'
              label='Category Description'
              placeholder='New description'
            />
            <Stack direction='row' spacing={2} alignItems='center'>
              <Button onClick={openDeleteDialog}>
                <DeleteIcon color='warning' />
              </Button>
              <AlertDialog
                isOpen={isDeleteDialogOpen}
                handleCloseDialog={closeDeleteDialog}
                categoryId={categoryId}
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

export default CategoryUpdate
