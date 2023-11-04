import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, FTextField } from '../../components/form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { createCategory, getCategories } from './categorySlice'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Modal, Box, Typography } from '@mui/material'
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
function CategoryCreate ({ handleOpen, handleClose }) {
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
    <Modal
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
          <Typography mb={2} variant='h6' gutterBottom component='h1'>
            Create category
          </Typography>
          <Stack spacing={3}>
            <FTextField
              sx={{ width: '30ch' }}
              name='name'
              label='Category Name'
              placeholder='Name'
            />
            <FTextField
              sx={{ width: '30ch' }}
              name='description'
              label='Description'
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
      </Box>
    </Modal>
  )
}
export default CategoryCreate
