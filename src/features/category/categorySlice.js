import { createSlice } from '@reduxjs/toolkit'
import apiService from '../../app/apiService'
import { toast } from 'react-toastify'
import { CATEGORY_PAGE_SIZE } from '../../app/config'

const initialState = {
  isLoading: false,
  error: null,
  categories: [],
  totalPages: 0,
  totalCategories: 0
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
      state.categories = action.payload.categories
      state.totalPages = action.payload.totalPages
      state.totalCategories = action.payload.totalCategories
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
    async (dispatch) => {
      dispatch(categorySlice.actions.startLoading())
      try {
        const response = await apiService.post('/categories', {
          name,
          description
        })
        dispatch(categorySlice.actions.createCategorySuccess(response.data))
        toast.success('Created category successfully')
        dispatch(getCategories(1, CATEGORY_PAGE_SIZE))
      } catch (error) {
        dispatch(categorySlice.actions.hasError(error.error))
        toast.error(error.error)
      }
    }

export const getCategories = (page = 1, limit = CATEGORY_PAGE_SIZE, search) => async (dispatch) => {
  dispatch(categorySlice.actions.startLoading())
  try {
    let url = `/categories?page=${page}&limit=${limit}`
    if (search) url += `&search=${search}`

    const response = await apiService.get(url)
    dispatch(categorySlice.actions.getCategorySuccess(response.data))
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}
export const getAllCategories = () => async (dispatch) => {
  dispatch(categorySlice.actions.startLoading())
  try {
    const response = await apiService.get('/categories/all')
    dispatch(categorySlice.actions.getCategorySuccess(response.data))
  } catch (error) {
    dispatch(categorySlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}

export const updateCategory =
  ({ id, name, description }) =>
    async (dispatch) => {
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

export const deleteCategory = (id) => async (dispatch) => {
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
