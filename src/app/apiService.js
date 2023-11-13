import axios from 'axios'
import { BASE_URL } from './config'

const apiService = axios.create({
  baseURL: `${BASE_URL}/api`
})

apiService.interceptors.request.use(
  (request) => {
    // console.log('Start Request', request)
    return request
  },
  function (error) {
    console.log('REQUEST ERROR', error)
    return Promise.reject(error)
  }
)

apiService.interceptors.response.use(
  (response) => {
    // console.log('Response', response)
    return response
  },
  function (error) {
    console.log('RESPONSE ERROR', error)
    const message =
      error.response?.data?.error ||
      error.response?.data?.errors[0].msg ||
      'Unknown error'
    return Promise.reject({ error: message })
  }
)

export default apiService
