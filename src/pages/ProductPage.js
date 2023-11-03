import React, { useState } from 'react'
import ProductCreate from '../features/product/ProductCreate'
import { Container, Button } from '@mui/material'
import ProductList from '../features/product/ProductList'
import ProductUpdate from '../features/product/ProductUpdate'

function ProductPage () {
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [isUpdateProductOpen, setIsUpdateProductOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedProductName, setSelectedProductName] = useState('')
  const [selectedProductPrice, setSelectedProductPrice] = useState('')
  const [selectedProductImage, setSelectedProductImage] = useState('')
  const [selectedProductCategory, setSelectedProductCategory] = useState('')

  const handleOpenCreateProduct = () => {
    setIsCreateProductOpen(true)
  }

  const handleCloseCreateProduct = () => {
    setIsCreateProductOpen(false)
  }

  const handleOpenUpdateProduct = (productId, productName, productPrice, productImage, productCategory) => {
    setSelectedProductId(productId)
    setSelectedProductName(productName)
    setSelectedProductPrice(productPrice)
    setSelectedProductImage(productImage)
    setSelectedProductCategory(productCategory)
    setIsUpdateProductOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseUpdateProduct = () => {
    setIsUpdateProductOpen(false)
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Button variant='contained' onClick={handleOpenCreateProduct}>
        Create a product
      </Button>
      {isCreateProductOpen && (
        <ProductCreate handleClose={handleCloseCreateProduct} />
      )}
      {isUpdateProductOpen && (
        <ProductUpdate
          productName={selectedProductName}
          productId={selectedProductId}
          productPrice={selectedProductPrice}
          productImage={selectedProductImage}
          productCategory={selectedProductCategory}
          handleClose={handleCloseUpdateProduct}
        />
      )}
      <ProductList handleOpenUpdateProduct={handleOpenUpdateProduct} />
    </Container>
  )
}

export default ProductPage
