const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  addReview,
  getBestSellers
} = require('../controllers/productController');
const { protect, authorizeSeller, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/best-sellers', getBestSellers);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/review', protect, addReview);

// Seller routes
router.post('/', protect, createProduct);
router.get('/seller/my-products', protect, authorizeSeller, getSellerProducts);
router.put('/:id', protect, authorizeSeller, updateProduct);
router.delete('/:id', protect, authorizeSeller, deleteProduct);

module.exports = router;
