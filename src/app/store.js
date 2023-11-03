import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import productReducer from '../features/product/productSlice'
import categoryReducer from '../features/category/categorySlice'
import orderReducer from '../features/order/orderSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    user: userReducer
  }
})
