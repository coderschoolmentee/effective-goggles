import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { updateCategory, getCategories } from './categorySlice'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AlertDialog from './CategoryDelete'
const yupSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required')
})

function CategoryUpdate ({ handleClose, categoryId, categoryName }) {
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
      description: ''
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
  }, [categoryName, setValue])

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Update category name
      </Typography>
      <Stack spacing={3}>
        <FTextField
          sx={{ width: '50ch' }}
          name='name'
          label='Category Name'
          placeholder='New name'
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
  )
}

export default CategoryUpdate
