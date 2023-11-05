import React, { useState, useEffect } from 'react'
import { Container, Typography, TextField, Stack, Paper } from '@mui/material'
import { getOrders } from '../features/order/orderSlice'
import { useSelector, useDispatch } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatNumber } from '../utils/formatNumber'
import LoadingScreen from '../components/LoadingScreen'
function StatsPage () {
  const { isLoading, error, orders } = useSelector((state) => state.order)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  if (isLoading) {
    return (
      <Container sx={{ mt: 2 }}>
        <LoadingScreen />
      </Container>
    )
  } else if (error) {
    <Typography mt={2} variant='h6' gutterBottom component='h1'>
      Error Loading...
    </Typography>
  }
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    return (
      orderDate.getDate() === selectedDate.getDate() &&
      orderDate.getMonth() === selectedDate.getMonth() &&
      orderDate.getFullYear() === selectedDate.getFullYear()
    )
  })
  const startHour = 7
  const endHour = 23

  const allHours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => startHour + index
  )

  const data = {}
  allHours.forEach((hour) => {
    const totalAmount = filteredOrders
      .filter((order) => new Date(order.createdAt).getHours() === hour)
      .reduce((total, order) => total + order.totalAmount, 0)
    data[hour] = totalAmount
  })

  const formatHour = (hour) => {
    return `${hour}h`
  }
  const chartData = allHours.map((hour) => ({
    name: formatHour(hour),
    totalAmount: data[hour] || 0
  }))
  const totalAmountForSelectedDate = filteredOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  )
  return (
    <Container sx={{ mt: 2 }}>
      <Stack spacing={3} mb={2} direction='row' alignItems='center'>
        <TextField
          id='date'
          label='Select Date'
          type='date'
          defaultValue={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Typography mt={2} variant='h6' gutterBottom component='h1'>
          Total: {formatNumber(totalAmountForSelectedDate)}
        </Typography>
      </Stack>
      <Paper sx={{ overflowX: 'auto', p: 1 }}>
        <BarChart
          width={1000}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis tick={{ fontSize: 12 }} dataKey='name' />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
          <Tooltip formatter={formatNumber} />
          <Bar dataKey='totalAmount' fill='#6D4C41' barSize={20} />
        </BarChart>
      </Paper>
    </Container>
  )
}
export default StatsPage
