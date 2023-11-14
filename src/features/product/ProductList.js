import {
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Table,
  TableBody,
  Stack,
  Pagination,
  TextField,
  Button
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from './productSlice'
import { DEBOUNCE_DELAY, PRODUCT_PAGE_SIZE } from '../../app/config'
import { formatNumber } from '../../utils/formatNumber'
import LoadingScreen from '../../components/LoadingScreen'
import { debounce } from 'lodash'
import BackspaceIcon from '@mui/icons-material/Backspace'
const CustomizedTableRow = styled(TableRow)`
  :hover {
    cursor: pointer;
  }
`
function ProductList ({ handleOpenUpdateProduct }) {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [hasSearchTerm, setHasSearchTerm] = useState(false)
  const dispatch = useDispatch()
  const { isLoading, error, products, totalProducts } = useSelector(
    (state) => state.product
  )
  // eslint-disable-next-line
  const debouncedHandleSearch = useCallback(
    debounce((value) => {
      setPage(1)
      dispatch(getProducts(1, PRODUCT_PAGE_SIZE, value))
    }, DEBOUNCE_DELAY),
    [dispatch]
  )

  useEffect(() => {
    debouncedHandleSearch(searchInput)
  }, [searchInput, debouncedHandleSearch])

  const handleChange = (event, value) => {
    setPage(value)
    console.log('Selected page:', value)
    dispatch(getProducts(value, PRODUCT_PAGE_SIZE, searchInput))
  }
  const handleClearSearch = () => {
    setSearchInput('')
    setHasSearchTerm(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }
  if (error) {
    return <Typography>Error occurred: {error}</Typography>
  }
  const productData = products || []
  return (
    <>
      <Stack direction='row' sx={{ mb: 1 }} spacing={1} alignItems='center'>
        {productData.length > 0 && (
          <TextField
            size='small'
            sx={{ my: 1, mr: 1, display: 'block' }}
            label='Search Products'
            variant='outlined'
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setHasSearchTerm(!!e.target.value.trim())
            }}
          />
        )}
        {hasSearchTerm && (
          <Button
            variant='outlined'
            size='small'
            onClick={handleClearSearch}
            sx={{ marginLeft: 1 }}
          >
            <BackspaceIcon />
          </Button>
        )}
      </Stack>
      {productData.length > 0 && (
        <Typography mt={2} variant='h6' gutterBottom component='h1'>
          Product List
        </Typography>
      )}
      {searchInput && productData.length === 0 && (
        <Typography>No products found.</Typography>
      )}
      {productData.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.map((product) => (
                <CustomizedTableRow
                  key={product._id}
                  onClick={() => {
                    handleOpenUpdateProduct(
                      product._id,
                      product.name,
                      product.price,
                      product.imageLink,
                      (product.category && product.category.name) || 'N/A'
                    )
                  }}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{formatNumber(product.price)}</TableCell>
                  <TableCell>
                    {product.category && product.category.name
                      ? product.category.name
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <img height={50} src={product.imageLink} alt='a drink' />
                  </TableCell>
                </CustomizedTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {productData.length !== 0 && (
        <Stack my={2} spacing={2} alignItems='center'>
          <Pagination
            count={Math.ceil(totalProducts / PRODUCT_PAGE_SIZE)}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </>
  )
}
export default ProductList
