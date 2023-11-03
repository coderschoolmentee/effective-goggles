import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch } from 'react-redux'
import { deleteProduct } from './productSlice'

export default function AlertDialog ({ isOpen, handleCloseDialog, productId }) {
  const dispatch = useDispatch()
  const handleDelete = () => {
    dispatch(deleteProduct(productId))
    handleCloseDialog()
  }

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog}>
      <DialogTitle id='alert-dialog-title'>Remove this product?</DialogTitle>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
