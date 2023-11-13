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
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
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
  const hasProductsInCart = Object.keys(cart).length > 0
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '720px' }}>
      <Table ref={componentRef} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            {!isCheckoutButtonDisabled && hasProductsInCart && (
              <TableCell>Remove</TableCell>
            )}
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
                <TableCell>
                  <Stack direction='row' alignItems='center'>
                    {!isCheckoutButtonDisabled && (
                      <IconButton
                        onClick={() => handleEditQuantity(productId, 'add')}
                      >
                        <AddIcon />
                      </IconButton>
                    )}

                    {quantity}
                    {!isCheckoutButtonDisabled && (
                      <IconButton
                        onClick={() => handleEditQuantity(productId, 'remove')}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>{formatNumber(product.price * quantity)}</TableCell>
                {!isCheckoutButtonDisabled && hasProductsInCart && (
                  <TableCell>
                    <Stack direction='row' spacing={1}>
                      <IconButton
                        onClick={() => handleDeleteProduct(productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                )}
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
