// features/order/orderSlice.js
import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { toast } from 'react-toastify'

const initialState = {
  isLoading: false,
  error: null,
  orders: []
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    startLoading (state) {
      state.isLoading = true
    },
    hasError (state, action) {
      state.isLoading = false
      state.error = action.payload
    },
    createOrderSuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    getOrdersSuccess (state, action) {
      state.isLoading = false
      state.error = null
      state.orders = action.payload
    },
    updateOrderSuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    deleteOrderSuccess (state, action) {
      state.isLoading = false
      state.error = null
    }
  }
})

export const {
  startLoading,
  hasError,
  createOrderSuccess,
  getOrdersSuccess,
  updateOrderSuccess,
  deleteOrderSuccess
} = orderSlice.actions

export const createOrder = orderData => async dispatch => {
  dispatch(startLoading())
  try {
    const response = await apiService.post('/orders', orderData)
    dispatch(createOrderSuccess(response.data))
    toast.success('Order created successfully')
    dispatch(getOrders())
    return response.data
  } catch (error) {
    dispatch(hasError(error.message))
    toast.error(error.message)
    throw error
  }
}

export const getOrders = () => async dispatch => {
  dispatch(startLoading())
  try {
    const response = await apiService.get('/orders')
    dispatch(getOrdersSuccess(response.data))
  } catch (error) {
    dispatch(hasError(error.message))
    toast.error(error.message)
  }
}

export default orderSlice.reducer
