import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch } from 'react-redux'
import { deleteCategory } from './categorySlice'

export default function AlertDialog ({ isOpen, handleCloseDialog, categoryId }) {
  const dispatch = useDispatch()
  const handleDelete = () => {
    dispatch(deleteCategory(categoryId))
    handleCloseDialog()
  }

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog}>
      <DialogTitle id='alert-dialog-title'>Remove this category?</DialogTitle>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
