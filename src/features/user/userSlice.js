import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import apiService from '../../app/apiService'
import { cloudinaryUpload } from '../../utils/cloudinary'
const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading (state) {
      state.isLoading = true
    },
    hasError (state, action) {
      state.isLoading = false
      state.error = action.payload
    },
    updateUserProfileSuccess (state, action) {
      state.isLoading = false
      state.error = null
      const updatedUser = action.payload.user
      state.updatedProfile = updatedUser
    }
  }
})
export const updateUserProfile =
  ({ userId, oldPassword, newPassword, avatarUrl }) =>
    async (dispatch) => {
      dispatch(userSlice.actions.startLoading())
      try {
        const data = {
          oldPassword,
          newPassword,
          avatarUrl
        }
        if (avatarUrl instanceof File) {
          const imageUrl = await cloudinaryUpload(avatarUrl)
          data.avatarUrl = imageUrl
        }
        const response = await apiService.put(`/users/${userId}`, data)
        dispatch(userSlice.actions.updateUserProfileSuccess(response.data))
        dispatch(getCurrentUserProfile())
        toast.success('Update Profile successfully')
      } catch (error) {
        dispatch(userSlice.actions.hasError(error.error))
        toast.error(error.error)
      }
    }

export const getCurrentUserProfile = () => async (dispatch) => {
  dispatch(userSlice.actions.startLoading())
  try {
    const response = await apiService.get('/users/me')
    dispatch(userSlice.actions.updateUserProfileSuccess(response.data))
  } catch (error) {
    dispatch(userSlice.actions.hasError(error))
  }
}
export default userSlice.reducer
