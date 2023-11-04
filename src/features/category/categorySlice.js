import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { toast } from 'react-toastify'

const initialState = {
  isLoading: false,
  error: null,
  categories: []
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    startLoading (state) {
      state.isLoading = true
    },
    hasError (state, action) {
      state.isLoading = false
      state.error = action.payload
    },
    createCategorySuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    getCategorySuccess (state, action) {
      state.isLoading = false
      state.error = null
      state.categories = action.payload
    },
    updateCategorySuccess (state, action) {
      state.isLoading = false
      state.error = null
    },
    deleteCategorySuccess (state, action) {
      state.isLoading = false
      state.error = null
    }
  }
})

export const createCategory =
  ({ name, description }) =>
    async dispatch => {
      dispatch(categorySlice.actions.startLoading())
      try {
        const response = await apiService.post('/categories', {
          name,
          description
        })
        dispatch(categorySlice.actions.createCategorySuccess(response.data))
        toast.success('Created category successfully')
        dispatch(getCategories())
      } catch (error) {
        dispatch(categorySlice.actions.hasError(error.error))
        toast.error(error.error)
      }
    }

export const getCategories = () => async dispatch => {
  dispatch(categorySlice.actions.startLoading())
  try {
    const response = await apiService.get('/categories')
    dispatch(categorySlice.actions.getCategorySuccess(response.data))
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}

export const updateCategory = ({ id, name, description }) => async dispatch => {
  dispatch(categorySlice.actions.startLoading())
  try {
    const response = await apiService.put(`/categories/${id}`, {
      name,
      description
    })
    dispatch(categorySlice.actions.updateCategorySuccess(response.data))
    toast.success('Updated category successfully')
    dispatch(getCategories())
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}

export const deleteCategory = (id) => async dispatch => {
  dispatch(categorySlice.actions.startLoading())
  try {
    const response = await apiService.delete(`/categories/${id}`)
    dispatch(categorySlice.actions.deleteCategorySuccess(response.data))
    toast.success('Deleted category successfully')
    dispatch(getCategories())
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}

export default categorySlice.reducer
