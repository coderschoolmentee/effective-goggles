import { createContext, useReducer, useEffect } from 'react'
import { useSelector } from 'react-redux'
import apiService from '../app/apiService'
import { isValidToken } from '../utils/jwt'
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null
}
const INITIALIZE = 'AUTH.INITIALIZE'
const LOGIN_SUCCESS = 'AUTH.LOGIN_SUCCESS'
const REGISTER_SUCCESS = 'AUTH.REGISTER_SUCCESS'
const LOGOUT = 'AUTH.LOGOUT'
const reducer = (state, action) => {
  let isAuthenticated, user
  switch (action.type) {
    case INITIALIZE:
      ;({ isAuthenticated, user } = action.payload)
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }
    default:
      return state
  }
}
const setSession = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem('accessToken', accessToken)
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  } else {
    window.localStorage.removeItem('accessToken')
    delete apiService.defaults.headers.common.Authorization
  }
}
const AuthContext = createContext({ ...initialState })
function AuthProvider ({ children }) {
  const updatedProfile = useSelector((state) => state.user.updatedProfile)
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken')
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken)
          const updatedUser =
            updatedProfile || (await apiService.get('/users/me')).data.user
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user: updatedUser }
          })
        } else {
          setSession(null)
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null }
          })
        }
      } catch (err) {
        console.error(err)
        setSession(null)
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null }
        })
      }
    }
    initialize()
  }, [updatedProfile])
  const login = async ({ email, password }, callback) => {
    const response = await apiService.post('/auth/login', { email, password })
    const { user, accessToken } = response.data
    setSession(accessToken)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user }
    })
    callback()
  }
  const register = async ({ name, email, password, role }, callback) => {
    const response = await apiService.post('/users/register', {
      name,
      email,
      password,
      role
    })
    const { user, accessToken } = response.data
    setSession(accessToken)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user }
    })
    callback()
  }
  const logout = async (callback) => {
    setSession(null)
    dispatch({ type: LOGOUT })
    callback()
  }
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export { AuthContext, AuthProvider }
