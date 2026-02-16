const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, authorizeSeller, authorize } = require('../middleware/auth');

// Protected user routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Seller routes
router.get('/seller/my-orders', protect, authorizeSeller, getSellerOrders);
router.put('/:id/status', protect, authorizeSeller, updateOrderStatus);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllOrders);

module.exports = router;
