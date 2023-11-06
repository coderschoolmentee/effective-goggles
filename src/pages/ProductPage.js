import React, { useState, useEffect } from 'react'
import ProductCreate from '../features/product/ProductCreate'
import { Container, Button } from '@mui/material'
import ProductList from '../features/product/ProductList'
import ProductUpdate from '../features/product/ProductUpdate'
import { getCategories } from '../features/category/categorySlice'
import { useDispatch, useSelector } from 'react-redux'
function ProductPage () {
  const { categories } = useSelector((state) => state.category)
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [isUpdateProductOpen, setIsUpdateProductOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedProductName, setSelectedProductName] = useState('')
  const [selectedProductPrice, setSelectedProductPrice] = useState('')
  const [selectedProductImage, setSelectedProductImage] = useState('')
  const [selectedProductCategory, setSelectedProductCategory] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  const handleOpenCreateProduct = () => {
    setIsCreateProductOpen(true)
  }
  const handleCloseCreateProduct = () => {
    setIsCreateProductOpen(false)
  }
  const handleOpenUpdateProduct = (
    productId,
    productName,
    productPrice,
    productImage,
    productCategory
  ) => {
    setSelectedProductId(productId)
    setSelectedProductName(productName)
    setSelectedProductPrice(productPrice)
    setSelectedProductImage(productImage)
    setSelectedProductCategory(productCategory)
    setIsUpdateProductOpen(true)
  }
  const handleCloseUpdateProduct = () => {
    setIsUpdateProductOpen(false)
  }
  return (
    <Container sx={{ mt: 2 }}>
      <Button
        sx={{ mb: 1 }}
        variant='contained'
        onClick={handleOpenCreateProduct}
      >
        Create a product
      </Button>
      {isCreateProductOpen && (
        <ProductCreate
          categories={categories}
          handleOpen={handleOpenCreateProduct}
          handleClose={handleCloseCreateProduct}
        />
      )}
      {isUpdateProductOpen && (
        <ProductUpdate
          handleOpen={handleOpenUpdateProduct}
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
