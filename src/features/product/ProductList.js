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
  TextField
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
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const { isLoading, error, products } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  if (isLoading) {
    return <LoadingScreen />
  }
  if (error) {
    return <Typography>Error occurred: {error}</Typography>
  }

  const filteredProducts = products.filter((product) => {
    if (searchTerm) {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

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
                    product.category ? product.category.name : 'N/A'
                  )
                }}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatNumber(product.price)}</TableCell>
                <TableCell>
                  {product.category ? product.category.name : 'N/A'}
                </TableCell>
                <TableCell>
                  <img height={50} src={product.imageLink} alt='a drink' />
                </TableCell>
              </CustomizedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {products.length !== 0 && (
        <Stack my={2} spacing={2} alignItems='center'>
          <Pagination
            count={Math.ceil(filteredProducts.length / pageSize)}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </>
  )
}

export default ProductList
