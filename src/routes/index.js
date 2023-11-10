import { Routes, Route } from 'react-router-dom'
import BlankLayout from '../layouts/BlankLayout'
import MainLayout from '../layouts/MainLayout'
import DetailPage from '../pages/DetailPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import AuthRequire from './AuthRequire'
import AccountPage from '../pages/AccountPage'
import RegisterPage from '../pages/RegisterPage'
import Product from '../pages/ProductPage'
import { Counter } from '../features/counter/counter'

import CategoryPage from '../pages/CategoryPage'
import OrderPage from '../pages/OrderPage'
import StatsPage from '../pages/StatsPage'
import ResetPwdPage from '../pages/ResetPwdPage'
import VerifyEmailPage from '../pages/VerifyEmailPage'

function Router () {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <AuthRequire>
            <MainLayout />
          </AuthRequire>
        }
      >
        <Route index element={<HomePage />} />

        <Route path='account' element={<AccountPage />} />
        <Route path='products' element={<Product />} />
        <Route path='categories' element={<CategoryPage />} />
        <Route path='orders' element={<OrderPage />} />
        <Route path='counter' element={<Counter />} />
        <Route path='stats' element={<StatsPage />} />
        <Route path='product/:id' element={<DetailPage />} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/reset' element={<ResetPwdPage />} />
      </Route>
      <Route path='/verify/:token' element={<VerifyEmailPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default Router
