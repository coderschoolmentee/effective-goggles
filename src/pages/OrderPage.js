import { Container } from '@mui/material'
import OrderList from '../features/order/OrderList'

function OrderPage () {
  return (
    <Container sx={{ mt: 2 }}>
      <OrderList />
    </Container>
  )
}

export default OrderPage
