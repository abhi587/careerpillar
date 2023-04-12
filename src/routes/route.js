const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController')
const ProductController = require('../controller/productController')

router.post('/createCategory',CategoryController.createCategory)

router.get('/categoryDetails',CategoryController.getCategoryDetails)

router.put("/updateCategory/:categoryId" , CategoryController.updateCategory)

router.delete("/deleteCategory/:categoryId" , CategoryController.deleteCategory)

router.post('/createProduct', ProductController.createProduct)

router.get('/productDetails', ProductController.getProductDetails)

router.put("/updateProduct/:productId" , ProductController.updateProduct)

router.delete("/deleteProduct/:productId" , ProductController.deleteProduct)


module.exports = router;