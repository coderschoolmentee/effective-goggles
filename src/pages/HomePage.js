import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'
import { useReactToPrint } from 'react-to-print'
import { getProducts } from '../features/product/productSlice'
import { createOrder } from '../features/order/orderSlice'
import { getCategories } from '../features/category/categorySlice'
import { formatNumber } from '../utils/formatNumber'
import { paginate } from '../utils/paginate'

import {
  Typography,
  Container,
  TextField,
  MenuItem,
  Select,
  Pagination,
  Box,
  Paper,
  Grid,
  Button,
  Stack
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { DASHBOARD_PAGE_SIZE } from '../app/config'
import SingleOrderTable from '../features/order/SingleOrderTable'
const CustomedGrid = styled(Grid)`
  :hover {
    cursor: pointer;
  }
`
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))
function HomePage () {
  const auth = useAuth()
  const componentRef = useRef()
  const [orderId, setOrderId] = useState(null)
  const [isPrintButtonDisabled, setIsPrintButtonDisabled] = useState(true)
  const [isCheckoutButtonDisabled, setIsCheckoutButtonDisabled] =
    useState(false)
  const [printTime, setPrintTime] = useState('')
  const [page, setPage] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [cart, setCart] = useState({})
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const {
    isLoading: productIsLoading,
    error: productError,
    products
  } = useSelector((state) => state.product)
  const {
    isLoading: categoryIsLoading,
    error: categoryError,
    categories
  } = useSelector((state) => state.category)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const filteredProducts = products.filter((product) => {
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    if (categoryFilter) {
      return (
        product.category.name.toLowerCase() === categoryFilter.toLowerCase()
      )
    }
    return true
  })
  const pageSize = DASHBOARD_PAGE_SIZE
  const paginatedArray = paginate(filteredProducts, pageSize, page)
  const handleChange = (event, value) => {
    setPage(value)
  }
  const addToCart = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product._id]: (prevCart[product._id] || 0) + 1
    }))
    setTotalPrice((prevPrice) => prevPrice + product.price)
  }
  const handleEditQuantity = (productId) => {
    const newQuantity = prompt('Enter new quantity:', cart[productId])
    const parsedQuantity = parseInt(newQuantity)
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: parsedQuantity
      }))
      const product = products.find((product) => product._id === productId)
      setTotalPrice(
        (prevPrice) =>
          prevPrice + (parsedQuantity - cart[productId]) * product.price
      )
    } else {
      alert('Invalid quantity. Please enter a valid number.')
    }
  }
  const handleDeleteProduct = (productId) => {
    const product = products.find((product) => product._id === productId)
    if (product) {
      const productPrice = product.price * cart[productId]

      setCart((prevCart) => {
        const newCart = { ...prevCart }
        delete newCart[productId]
        return newCart
      })

      setTotalPrice((prevPrice) => prevPrice - productPrice)
    }
  }
  const handleClean = () => {
    setCart({})
    setTotalPrice(0)
    setPrintTime('')
    setIsCheckoutButtonDisabled(false)
    setIsPrintButtonDisabled(true)
    setOrderId(null)
  }
  const handleCheckout = async () => {
    if (totalPrice > 0) {
      const orderData = {
        totalAmount: totalPrice,
        items: Object.entries(cart).map(([productId, quantity]) => {
          const product = products.find((p) => p._id === productId)
          const itemPrice = product.price * quantity
          return {
            product: productId,
            quantity,
            price: itemPrice
          }
        })
      }
      try {
        // Dispatch the action and get the entire order object
        const createdOrder = await dispatch(createOrder(orderData))
        console.log('createdOrder', createdOrder)
        setOrderId(createdOrder.order._id) // Assuming _id is the order ID field
      } catch (error) {
        alert(`Error creating order: ${error.message}`)
        // Handle error as needed
      }
      setPrintTime(new Date().toLocaleString())
      setIsCheckoutButtonDisabled(true)
      setIsPrintButtonDisabled(false)
    } else {
      alert('Total price is zero. Add items to the cart before checking out.')
    }
  }
  useEffect(() => {
    dispatch(getProducts())
    dispatch(getCategories())
  }, [dispatch])
  if (!auth.user) {
    return <p>You are not logged in.</p>
  }
  if (productIsLoading) {
    return (
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Loading Products ...
      </Typography>
    )
  }
  if (categoryIsLoading) {
    return (
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Loading Categories ...
      </Typography>
    )
  }
  if (productError) {
    return (
      <Typography>
        Error occurred while fetching products: {productError}
      </Typography>
    )
  }
  if (categoryError) {
    return (
      <Typography>
        Error occurred while fetching categories: {categoryError}
      </Typography>
    )
  }
  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              size='small'
              sx={{ mb: 1, mr: 1 }}
              label='Search Products'
              variant='outlined'
              value={searchTerm}
              onChange={(e) => {
                setPage(1)
                setSearchTerm(e.target.value)
              }}
            />
            <Select
              size='small'
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              displayEmpty
            >
              <MenuItem value=''>
                <em>All</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            <Grid container spacing={2}>
              {paginatedArray.map((product, index) => (
                <CustomedGrid
                  key={product._id}
                  item
                  xs={4}
                  sm={3}
                  md={2}
                  onClick={() => addToCart(product)}
                >
                  <Item>
                    <img height={50} src={product.imageLink} alt='drink' />
                  </Item>
                  <Typography
                    variant='body2'
                    sx={{ fontSize: 12 }}
                    color='text.secondary'
                    gutterBottom
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ fontSize: 12 }}
                    color='text.secondary'
                    gutterBottom
                  >
                    {formatNumber(product.price)}
                  </Typography>
                </CustomedGrid>
              ))}
            </Grid>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(filteredProducts.length / pageSize)}
                page={page}
                onChange={handleChange}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                mb: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1
              }}
            >
              <Button
                disabled={isCheckoutButtonDisabled}
                variant='outlined'
                onClick={handleCheckout}
              >
                Sale
              </Button>
              <Button
                disabled={isPrintButtonDisabled}
                variant='outlined'
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button variant='outlined' onClick={handleClean}>
                Clear
              </Button>
            </Box>
            <SingleOrderTable
              componentRef={componentRef}
              cart={cart}
              products={products}
              handleEditQuantity={handleEditQuantity}
              handleDeleteProduct={handleDeleteProduct}
              isCheckoutButtonDisabled={isCheckoutButtonDisabled}
              totalPrice={totalPrice}
              printTime={printTime}
              orderId={orderId}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
export default HomePage
