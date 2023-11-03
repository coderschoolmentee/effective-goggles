import {
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Table,
  TableBody
} from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories } from './categorySlice'
import LoadingScreen from '../../components/LoadingScreen'
const CustomizedTableRow = styled(TableRow)`
  :hover {
    cursor: pointer;
  }
`

function CategoryList ({ handleOpenUpdateCategory }) {
  const dispatch = useDispatch()
  const { isLoading, error, categories } = useSelector(state => state.category)

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  if (isLoading) {
    return (
      <>
        <Typography mt={2} variant='caption' gutterBottom component='h1'>
          Loading Categories ...
        </Typography>
        <LoadingScreen />
      </>

    )
  }
  if (error) {
    return (
      <Typography>Error occurred while fetching categories: {error}</Typography>
    )
  }
  return (
    <>
      <Typography mt={2} variant='h6' gutterBottom component='h1'>
        Category List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <CustomizedTableRow
                key={category._id}
                onClick={() =>
                  handleOpenUpdateCategory(category._id, category.name)}
              >
                <TableCell>{category.name}</TableCell>
              </CustomizedTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
export default CategoryList
