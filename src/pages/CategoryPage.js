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
  const [selectedCategoryDescription, setSelectedCategoryDescription] = useState('')

  const handleOpenCreateCategory = () => {
    setIsCreateCategoryOpen(true)
  }

  const handleCloseCreateCategory = () => {
    setIsCreateCategoryOpen(false)
  }

  const handleOpenUpdateCategory = (categoryId, categoryName, categoryDescription) => {
    setSelectedCategoryId(categoryId)
    setSelectedCategoryName(categoryName)
    setSelectedCategoryDescription(categoryDescription)
    setIsUpdateCategoryOpen(true)
  }

  const handleCloseUpdateCategory = () => {
    setIsUpdateCategoryOpen(false)
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Button sx={{ mb: 1 }} variant='contained' onClick={handleOpenCreateCategory}>
        Create a category
      </Button>
      {isCreateCategoryOpen && (
        <CategoryCreate handleOpen={handleOpenCreateCategory} handleClose={handleCloseCreateCategory} />
      )}
      {isUpdateCategoryOpen && (
        <CategoryUpdate
          handleOpen={handleOpenUpdateCategory}
          categoryName={selectedCategoryName}
          categoryId={selectedCategoryId}
          handleClose={handleCloseUpdateCategory}
          categoryDescription={selectedCategoryDescription}
        />
      )}
      <CategoryList handleOpenUpdateCategory={handleOpenUpdateCategory} />
    </Container>
  )
}

export default CategoryPage
