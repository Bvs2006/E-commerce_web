const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getSellerCoupons,
  applyCoupon,
  useCoupon,
  deleteCoupon,
  toggleCouponStatus
} = require('../controllers/couponController');
const { protect, authorizeSeller } = require('../middleware/auth');

// User routes
router.post('/apply', protect, applyCoupon);
router.post('/:code/use', protect, useCoupon);

// Seller routes
router.post('/', protect, authorizeSeller, createCoupon);
router.get('/seller/my-coupons', protect, authorizeSeller, getSellerCoupons);
router.delete('/:id', protect, authorizeSeller, deleteCoupon);
router.put('/:id/toggle', protect, authorizeSeller, toggleCouponStatus);

module.exports = router;
