import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatNumber } from '../../utils/formatNumber'

const SingleOrderTable = ({
  cart,
  products,
  handleEditQuantity,
  handleDeleteProduct,
  isCheckoutButtonDisabled,
  totalPrice,
  printTime,
  orderId,
  componentRef
}) => {
  return (
    <TableContainer component={Paper}>
      <Table ref={componentRef} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align='right'>Number</TableCell>
            <TableCell align='right'>Price</TableCell>
            {!isCheckoutButtonDisabled && <TableCell>Edit</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(cart).map(([productId, quantity]) => {
            const product = products.find(
              (product) => product._id === productId
            )
            return (
              <TableRow
                key={productId}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell component='th' scope='row'>
                  {product.name}
                </TableCell>
                <TableCell align='right'>{quantity}</TableCell>
                <TableCell align='right'>
                  {formatNumber(product.price * quantity)}
                </TableCell>
                {!isCheckoutButtonDisabled &&
                  <TableCell>

                    <Stack direction='row' spacing={1}>
                      <IconButton onClick={() => handleEditQuantity(productId)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteProduct(productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                  </TableCell>}
              </TableRow>
            )
          })}
          <TableRow>
            <TableCell colSpan={4}>
              Total Price: {formatNumber(totalPrice)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Time: {printTime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>Order ID: {orderId} </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SingleOrderTable
