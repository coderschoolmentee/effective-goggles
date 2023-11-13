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
  styled
} from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from './categorySlice'
import LoadingScreen from '../../components/LoadingScreen'
import { CATEGORY_PAGE_SIZE, DEBOUNCE_DELAY } from '../../app/config'
import { debounce } from 'lodash'
const CustomizedTableRow = styled(TableRow)`
  :hover {
    cursor: pointer;
  }
`

function CategoryList ({ handleOpenUpdateCategory }) {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const { isLoading, error, categories, totalCategories } = useSelector(
    (state) => state.category
  )
  // eslint-disable-next-line
  const debouncedHandleSearch = useCallback(
    debounce((value) => {
      setPage(1)
      dispatch(getCategories(1, CATEGORY_PAGE_SIZE, value))
    }, DEBOUNCE_DELAY),
    [dispatch]
  )

  useEffect(() => {
    debouncedHandleSearch(searchInput)
  }, [searchInput, debouncedHandleSearch])

  const handleChange = (event, value) => {
    setPage(value)
    dispatch(getCategories(value, CATEGORY_PAGE_SIZE, searchInput))
  }

  const categoryData = categories || []

  if (isLoading) {
    return <LoadingScreen />
  }
  if (error) {
    return <Typography color='error.main'>Error occurred: {error}</Typography>
  }
  return (
    <>
      <TextField
        size='small'
        sx={{ my: 1, mr: 1, display: 'block' }}
        label='Search Categories'
        variant='outlined'
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {categoryData.length > 0 && (
        <Typography mt={2} variant='h6' gutterBottom component='h1'>
          Category List
        </Typography>
      )}
      {searchInput && categoryData.length === 0 && (
        <Typography>No categories found.</Typography>
      )}

      {categoryData.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryData.map((category) => (
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
      )}
      {categoryData.length !== 0 && (
        <Stack my={2} spacing={2} alignItems='center'>
          <Pagination
            count={Math.ceil(totalCategories / CATEGORY_PAGE_SIZE)}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      )}
    </>
  )
}
export default CategoryList
