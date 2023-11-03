import React, { useState } from 'react'
import CategoryCreate from '../features/category/CategoryCreate'
import { Container, Button } from '@mui/material'
import CategoryList from '../features/category/CategoryList'
import CategoryUpdate from '../features/category/CategoryUpdate'

function CategoryPage () {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isUpdateCategoryOpen, setIsUpdateCategoryOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')

  const handleOpenCreateCategory = () => {
    setIsCreateCategoryOpen(true)
  }

  const handleCloseCreateCategory = () => {
    setIsCreateCategoryOpen(false)
  }

  const handleOpenUpdateCategory = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId)
    setSelectedCategoryName(categoryName)
    setIsUpdateCategoryOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseUpdateCategory = () => {
    setIsUpdateCategoryOpen(false)
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Button variant='contained' onClick={handleOpenCreateCategory}>
        Create a category
      </Button>
      {isCreateCategoryOpen && (
        <CategoryCreate handleClose={handleCloseCreateCategory} />
      )}
      {isUpdateCategoryOpen && (
        <CategoryUpdate
          categoryName={selectedCategoryName}
          categoryId={selectedCategoryId}
          handleClose={handleCloseUpdateCategory}
        />
      )}
      <CategoryList handleOpenUpdateCategory={handleOpenUpdateCategory} />
    </Container>
  )
}

export default CategoryPage
