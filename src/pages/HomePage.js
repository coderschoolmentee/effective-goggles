import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../hooks/useAuth'
import { useReactToPrint } from 'react-to-print'
import { getAllProducts } from '../features/product/productSlice'
import { createOrder } from '../features/order/orderSlice'
import { getAllCategories } from '../features/category/categorySlice'
import { formatNumber } from '../utils/formatNumber'
import { toast } from 'react-toastify'
import BackspaceIcon from '@mui/icons-material/Backspace'
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
import LoadingScreen from '../components/LoadingScreen'
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
  const { user } = useAuth()
  const componentRef = useRef()
  const [orderId, setOrderId] = useState(null)
  const [isPrintButtonDisabled, setIsPrintButtonDisabled] = useState(true)
  const [isClearButtonDisabled, setIsClearButtonDisabled] = useState(true)
  const [isCheckoutButtonDisabled, setIsCheckoutButtonDisabled] = useState(true)
  const [printTime, setPrintTime] = useState('')
  const [page, setPage] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [cart, setCart] = useState({})
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasSearchTerm, setHasSearchTerm] = useState(false)
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
    setIsCheckoutButtonDisabled(false)
    setIsClearButtonDisabled(false)
  }
  const handleEditQuantity = (productId, action) => {
    const currentQuantity = cart[productId] || 0
    let newQuantity
    if (action === 'add') {
      newQuantity = currentQuantity + 1
    } else {
      newQuantity = Math.max(0, currentQuantity - 1)
      if (newQuantity === 0) {
        handleDeleteProduct(productId)
        return
      }
    }
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: newQuantity
    }))

    const product = products.find((product) => product._id === productId)
    const priceChange = (newQuantity - currentQuantity) * product.price
    setTotalPrice((prevPrice) => prevPrice + priceChange)
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
    setIsPrintButtonDisabled(true)
    setOrderId(null)
    setIsCheckoutButtonDisabled(true)
    setIsClearButtonDisabled(true)
  }
  const handleClearSearch = () => {
    setSearchTerm('')
    setHasSearchTerm(false)
    setCategoryFilter('')
  }
  const formatTime = () => {
    const currentDate = new Date()
    const day = currentDate.getDate().toString().padStart(2, '0')
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear()

    const hours = currentDate.getHours().toString().padStart(2, '0')
    const minutes = currentDate.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes} ${day}/${month}/${year} `
  }

  const handleCheckout = async () => {
    if (totalPrice > 0) {
      const orderData = {
        staffName: user.name,
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
        const createdOrder = await dispatch(createOrder(orderData))
        setOrderId(createdOrder.order._id)
      } catch (error) {
        toast.error(`Error creating order: ${error.message}`)
      }
      setPrintTime(formatTime())
      setIsCheckoutButtonDisabled(true)
      setIsPrintButtonDisabled(false)
    } else {
      toast.error(
        'Total price is zero. Add items to the cart before checking out.'
      )
    }
  }
  useEffect(() => {
    dispatch(getAllProducts())
    dispatch(getAllCategories())
  }, [dispatch])

  if (!auth.user) {
    return <p>You are not logged in.</p>
  }
  if (productIsLoading || categoryIsLoading) {
    return <LoadingScreen />
  }
  if (productError) {
    return <Typography>Error occurred: {productError}</Typography>
  }
  if (categoryError) {
    return <Typography>Error occurred: {categoryError}</Typography>
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} md={8}>
            <Stack direction='row' sx={{ mb: 2 }} spacing={1} alignItems='center'>
              <TextField
                size='small'
                sx={{ mb: 2, mr: 1 }}
                label='Search Products'
                variant='outlined'
                value={searchTerm}
                onChange={(e) => {
                  setPage(1)
                  setSearchTerm(e.target.value)
                  setHasSearchTerm(!!e.target.value.trim())
                  setCategoryFilter('')
                }}
              />
              {hasSearchTerm && (
                <Button
                  variant='outlined'
                  size='small'
                  onClick={handleClearSearch}
                  sx={{ marginLeft: 1 }}
                >
                  <BackspaceIcon />
                </Button>)}
              <Select
                size='small'
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
                displayEmpty
                disabled={hasSearchTerm}
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
            </Stack>
            <Grid container spacing={2}>
              {paginatedArray.map((product, index) => (
                <CustomedGrid
                  key={product._id}
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  onClick={() => addToCart(product)}
                >
                  <Item>
                    <img width={100} src={product.imageLink} alt='a drink' />
                  </Item>
                  <Typography
                    variant='body1'
                    sx={{ fontSize: 12, mt: 1 }}
                    color='text.primary'
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
            {filteredProducts.length !== 0 && (
              <Stack my={2} spacing={2} alignItems='center'>
                <Pagination
                  count={Math.ceil(filteredProducts.length / pageSize)}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
            )}
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
                disabled={
                  isCheckoutButtonDisabled || Object.keys(cart).length === 0
                }
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
              <Button
                variant='outlined'
                onClick={handleClean}
                disabled={
                  isClearButtonDisabled || Object.keys(cart).length === 0
                }
              >
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
