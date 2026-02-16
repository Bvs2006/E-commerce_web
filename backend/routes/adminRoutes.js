const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getPlatformAnalytics,
  getWithdrawals,
  updateWithdrawalStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/analytics', protect, authorize('admin'), getPlatformAnalytics);
router.get('/withdrawals', protect, authorize('admin'), getWithdrawals);
router.put('/withdrawals/:id', protect, authorize('admin'), updateWithdrawalStatus);

module.exports = router;
