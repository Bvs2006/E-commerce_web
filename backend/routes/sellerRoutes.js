const express = require('express');
const router = express.Router();
const {
  applyToBecomeSeller,
  getSellerDashboard,
  updateShopSettings,
  getPendingSellers,
  updateSellerStatus,
  getAllSellers
} = require('../controllers/sellerController');
const { protect, authorizeSeller, authorize } = require('../middleware/auth');

// User routes (becoming a seller)
router.post('/apply', protect, applyToBecomeSeller);

// Seller routes
router.get('/dashboard', protect, authorizeSeller, getSellerDashboard);
router.put('/shop-settings', protect, authorizeSeller, updateShopSettings);

// Admin routes
router.get('/admin/pending', protect, authorize('admin'), getPendingSellers);
router.get('/admin/all', protect, authorize('admin'), getAllSellers);
router.put('/admin/:id/status', protect, authorize('admin'), updateSellerStatus);

module.exports = router;
