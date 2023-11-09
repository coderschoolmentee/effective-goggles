import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import apiService from '../../app/apiService'
import { cloudinaryUpload } from '../../utils/cloudinary'
const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  tokenData: null
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
      state.tokenData = null
    },
    updateUserProfileSuccess (state, action) {
      state.isLoading = false
      state.error = null
      const updatedUser = action.payload.user
      state.updatedProfile = updatedUser
    },
    sendResetTokenSuccess (state, action) {
      state.isLoading = false
      state.error = null
      state.tokenData = action.payload
    },
    resetPasswordSuccess (state, action) {
      state.isLoading = false
      state.error = null
      state.resetPasswordData = action.payload
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
        console.log('error reset', error)
        dispatch(userSlice.actions.hasError(error.error))
        toast.error(error.error)
      }
    }
export const sendPassWordResetToken = (email) => async (dispatch) => {
  dispatch(userSlice.actions.startLoading())
  try {
    const response = await apiService.post('/users/send-password-reset-token', {
      email
    })
    dispatch(userSlice.actions.sendResetTokenSuccess(response.data))
    toast.success('Token sent to email successfully')
  } catch (error) {
    console.log('error at sendPassWordResetToken', error)
    dispatch(userSlice.actions.hasError(error.error))
    toast.error(error.error)
  }
}

export const resetPassword =
  (email, token, newPassword) => async (dispatch) => {
    dispatch(userSlice.actions.startLoading())
    try {
      const response = await apiService.post('/users/reset-password', {
        email,
        token,
        newPassword
      })
      console.log('response at resetPassword', response)
      dispatch(userSlice.actions.resetPasswordSuccess(response.data))
      toast.success('Pasword reset successfully')
    } catch (error) {
      console.log('error at sendPassWordResetToken', error)
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
