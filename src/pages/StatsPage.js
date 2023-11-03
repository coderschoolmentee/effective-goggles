import React, { useState, useEffect } from 'react'
import { Container, Typography, TextField, Stack } from '@mui/material'
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

        <Typography mt={2} variant='caption' gutterBottom component='h1'>
          Loading Charts ...
        </Typography>
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
  const startHour = 7 // Starting hour
  const endHour = 23 // Ending hour

  const allHours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => startHour + index
  )

  // Prepare data for the chart
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
    totalAmount: data[hour] || 0 // Default to 0 if no orders for that hour
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
      <BarChart
        width={1200}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='5 5' />
        <XAxis tick={{ fontSize: 12 }} dataKey='name' />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
        <Tooltip formatter={formatNumber} />
        <Bar dataKey='totalAmount' fill='#8884d8' />
      </BarChart>
    </Container>
  )
}
export default StatsPage
