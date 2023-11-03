import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { cloudinaryUpload } from '../../utils/cloudinary'
import { toast } from 'react-toastify'

const initialState = {
  isLoading: false,
  error: null,
  products: []
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    startLoading (state) {
      state.isLoading = true
    },
    hasError (state, action) {
      state.isLoading = false
      state.error = action.payload
    },
    createProductSuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    getProductSuccess (state, action) {
      state.isLoading = false
      state.error = null
      state.products = action.payload
    },
    updateProductSuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    deleteProductSuccess (state, action) {
      state.isLoading = false
      state.error = null
    }
  }
})

export const createProduct =
  ({ name, price, category, imageLink }) =>
    async dispatch => {
      dispatch(productSlice.actions.startLoading())
      const imageUrl = await cloudinaryUpload(imageLink)
      try {
        const response = await apiService.post('/products', {
          name,
          price,
          category,
          imageLink: imageUrl
        })
        dispatch(productSlice.actions.createProductSuccess(response.data))
        toast.success('Created product successfully')
        dispatch(getProducts())
      } catch (error) {
        dispatch(productSlice.actions.hasError(error.message))
        toast.error(error.message)
      }
    }

export const getProducts = () => async dispatch => {
  dispatch(productSlice.actions.startLoading())
  try {
    const response = await apiService.get('/products')
    dispatch(productSlice.actions.getProductSuccess(response.data))
  } catch (error) {
    dispatch(productSlice.actions.hasError(error.message))
    toast.error(error.message)
  }
}

export const updateProduct = ({ id, name, price, imageLink, category }) => async dispatch => {
  dispatch(productSlice.actions.startLoading())
  const imageUrl = await cloudinaryUpload(imageLink)
  try {
    const response = await apiService.put(`/products/${id}`, {
      name,
      price,
      imageLink: imageUrl,
      category
    })
    dispatch(productSlice.actions.updateProductSuccess(response.data))
    toast.success('Updated product successfully')
    dispatch(getProducts())
  } catch (error) {
    dispatch(productSlice.actions.hasError(error.message))
    toast.error(error.message)
  }
}

export const deleteProduct = (id) => async dispatch => {
  dispatch(productSlice.actions.startLoading())
  try {
    const response = await apiService.delete(`/products/${id}`)
    dispatch(productSlice.actions.deleteProductSuccess(response.data))
    toast.success('Deleted product successfully')
    dispatch(getProducts())
  } catch (error) {
    dispatch(productSlice.actions.hasError(error.message))
    toast.error(error.message)
  }
}

export default productSlice.reducer
