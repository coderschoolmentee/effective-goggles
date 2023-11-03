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
  TextField // Import TextField from MUI
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from './productSlice'
import { PRODUCT_PAGE_SIZE } from '../../app/config'
import { paginate } from '../../utils/paginate'
import { formatNumber } from '../../utils/formatNumber'
import LoadingScreen from '../../components/LoadingScreen'
const CustomizedTableRow = styled(TableRow)`
  :hover {
    cursor: pointer;
  }
`

function ProductList ({ handleOpenUpdateProduct }) {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const dispatch = useDispatch()
  const { isLoading, error, products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  if (isLoading) {
    return (
      <>
        <Typography mt={2} variant='caption' gutterBottom component='h1'>
          Loading Products ...
        </Typography>
        <LoadingScreen />
      </>
    )
  }
  if (error) {
    return (
      <Typography>Error occurred while fetching products: {error}</Typography>
    )
  }

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  // Pagination
  const pageSize = PRODUCT_PAGE_SIZE
  const paginatedArray = paginate(filteredProducts, pageSize, page)
  const handleChange = (event, value) => {
    setPage(value)
  }

  return (
    <>
      <TextField
        size='small'
        sx={{ my: 1, mr: 1, display: 'block' }}
        label='Search Products'
        variant='outlined'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Product List
      </Typography>
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
            {paginatedArray.map((product) => (
              <CustomizedTableRow
                key={product._id}
                onClick={() => {
                  handleOpenUpdateProduct(
                    product._id,
                    product.name,
                    product.price,
                    product.imageLink,
                    product.category.name
                  )
                }}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatNumber(product.price)}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>
                  <img height={50} src={product.imageLink} alt='drink' />
                </TableCell>
              </CustomizedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(filteredProducts.length / pageSize)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </>
  )
}

export default ProductList
