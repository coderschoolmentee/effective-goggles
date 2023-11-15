import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { toast } from 'react-toastify'
const initialState = {
  isLoading: false,
  error: null,
  orders: [],
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0
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
      state.orders = action.payload.orders
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
      state.totalOrders = action.payload.totalOrders
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
export const createOrder = (orderData) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await apiService.post('/orders', orderData)
    dispatch(createOrderSuccess(response.data))
    toast.success('Order created successfully')
    return response.data
  } catch (error) {
    dispatch(hasError(error.message))
    toast.error(error.message)
    throw error
  }
}
export const getOrders = (page = 1, limit = 10, searchTerm = '', date = '') => async (dispatch) => {
  dispatch(startLoading())
  try {
    let url = `/orders?page=${page}&limit=${limit}`
    if (searchTerm) url += `&search=${searchTerm}`
    if (date) url += `&date=${date}`

    const response = await apiService.get(url)
    dispatch(getOrdersSuccess(response.data))
  } catch (error) {
    dispatch(hasError(error.message))
    toast.error(error.message)
  }
}

export default orderSlice.reducer
