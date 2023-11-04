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
import { getCategories } from './categorySlice'
import LoadingScreen from '../../components/LoadingScreen'
import { CATEGORY_PAGE_SIZE } from '../../app/config'
import { paginate } from '../../utils/paginate'
const CustomizedTableRow = styled(TableRow)`
  :hover {
    cursor: pointer;
  }
`

function CategoryList ({ handleOpenUpdateCategory }) {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { isLoading, error, categories } = useSelector(
    (state) => state.category
  )

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  // Filter products based on search term
  const filteredCategories = categories.filter((category) => {
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  // Pagination
  const pageSize = CATEGORY_PAGE_SIZE
  const paginatedArray = paginate(filteredCategories, pageSize, page)
  const handleChange = (event, value) => {
    setPage(value)
  }

  if (isLoading) {
    return <LoadingScreen />
  }
  if (error) {
    return <Typography>Error occurred: {error}</Typography>
  }
  return (
    <>
      <TextField
        size='small'
        sx={{ my: 1, mr: 1, display: 'block' }}
        label='Search Categories'
        variant='outlined'
        value={searchTerm}
        onChange={(e) => {
          setPage(1)
          setSearchTerm(e.target.value)
        }}
      />
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Category List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedArray.map((category) => (
              <CustomizedTableRow
                key={category._id}
                onClick={() =>
                  handleOpenUpdateCategory(
                    category._id,
                    category.name,
                    category.description
                  )}
              >
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
              </CustomizedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {categories.length !== 0 && (
        <Stack my={2} spacing={2} alignItems='center'>
          <Pagination
            count={Math.ceil(filteredCategories.length / pageSize)}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </>
  )
}
export default CategoryList
