import {
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Table,
  TableBody,
  Stack,
  TextField,
  Button,
  Pagination
} from '@mui/material'
import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders } from './orderSlice'
import emailjs from '@emailjs/browser'
import { paginate } from '../../utils/paginate'
import LoadingScreen from '../../components/LoadingScreen'
import {
  ORDER_PAGE_SIZE,
  YOUR_SERVICE_ID,
  YOUR_TEMPLATE_ID,
  YOUR_USER_ID
} from '../../app/config'
import { formatNumber } from '../../utils/formatNumber'
function OrderList () {
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const { isLoading, error, orders } = useSelector((state) => state.order)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [email, setEmail] = useState('')
  const pageSize = ORDER_PAGE_SIZE
  const paginatedArray = paginate(orders.slice().reverse(), pageSize, page)
  console.log('orders', orders)
  const handleChange = (event, value) => {
    setPage(value)
  }
  const handleEmailChange = (value) => {
    setEmail(value)
  }

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])
  const handleRowClick = (orderId) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId)
    setSelectedOrder(orders.find((order) => order._id === orderId))
  }
  const sendReceipt = (orderReceipt) => {
    if (!orderReceipt) {
      console.error('No selected order to send receipt')
      return
    }
    const tableRows = orderReceipt.items
      .map(
        (item) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left">${
          item.product.name
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left">${
          item.quantity
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: left">${item.price.toLocaleString()}</td>
      </tr>
    `
      )
      .join('')
    const formattedTotalAmount = formatNumber(selectedOrder.totalAmount)
    const message = `
      <p>Hello,</p>
      <p>Here is your receipt details for order <i>${orderReceipt._id}</i>:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left">Price</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <p>Total Amount: <b>${formattedTotalAmount}</b></p>
      <p>Coffee App</p>
    `
    const templateParams = {
      from_name: 'Cafe Shop',
      to_email: email,
      message
    }
    emailjs
      .send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams, YOUR_USER_ID)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text)
          toast.success('Email sent successfully')
        },
        (error) => {
          toast.error('Email sent failed')
          console.error('FAILED...', error)
        }
      )
    setSelectedOrderId(null)
  }
  if (isLoading) {
    return (
      <>
        <Typography mt={2} variant='caption' gutterBottom component='h1'>
          Loading Orders ...
        </Typography>
        <LoadingScreen />
      </>
    )
  }
  if (error) {
    return (
      <Typography>Error occurred while fetching orders: {error}</Typography>
    )
  }
  return (
    <>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Order List
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedArray.slice().map((order) => (
              <React.Fragment key={order._id}>
                <TableRow onClick={() => handleRowClick(order._id)}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
                {String(selectedOrderId) === String(order._id) && (
                  <TableRow>
                    <TableCell>
                      <TableContainer component={Paper}>
                        <Table size='small' aria-label='items'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell align='right'>Quantity</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.items.map((item) => (
                              <TableRow key={item.product._id}>
                                <TableCell component='th' scope='row'>
                                  {item.product.name}
                                </TableCell>
                                <TableCell align='right'>
                                  {item.quantity}
                                </TableCell>
                                <TableCell>{item.price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Stack spacing={2} mx={1} my={1} direction='row'>
                          <TextField
                            sx={{ width: '20ch' }}
                            type='email'
                            id='outlined-basic'
                            label='email'
                            variant='outlined'
                            onBlur={(e) => handleEmailChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleEmailChange(e.target.value)
                                // Additional logic to send the email
                                sendReceipt(selectedOrder)
                              }
                            }}
                          />

                          <Button
                            size='medium'
                            onClick={() => {
                              sendReceipt(selectedOrder)
                            }}
                            variant='outlined'
                          >
                            Send
                          </Button>
                        </Stack>
                      </TableContainer>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(orders.length / pageSize)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </>
  )
}
export default OrderList
