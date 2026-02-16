const express = require('express');
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Address routes
router.post('/address', protect, addAddress);
router.get('/addresses', protect, getAddresses);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

// Wishlist routes
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllUsers);
router.delete('/admin/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
