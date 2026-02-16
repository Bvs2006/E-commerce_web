const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Apply to become seller
// @route   POST /api/seller/apply
// @access  Private
exports.applyToBecomeSeller = async (req, res) => {
  try {
    const { shopName, shopPhone, shopAddress, shopGST, shopDescription } = req.body;

    const user = await User.findById(req.user._id);

    if (user.sellerStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'You are already an approved seller'
      });
    }

    if (user.sellerStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your seller application is already pending'
      });
    }

    user.shopName = shopName;
    user.shopPhone = shopPhone;
    user.shopAddress = shopAddress;
    user.shopGST = shopGST;
    user.shopDescription = shopDescription;
    user.sellerStatus = 'pending';

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Seller application submitted successfully. Waiting for admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        sellerStatus: user.sellerStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
exports.getSellerDashboard = async (req, res) => {
  try {
    // Get seller's products
    const products = await Product.find({ seller: req.user._id });
    const productCount = products.length;

    // Get seller's orders
    const orders = await Order.find({ 'orderItems.seller': req.user._id });
    const orderCount = orders.length;

    // Calculate total sales
    let totalSales = 0;
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.seller.toString() === req.user._id.toString()) {
          totalSales += item.price * item.quantity;
        }
      });
    });

    // Get earnings (90% of sales - 10% commission)
    const earnings = req.user.earnings || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders: orderCount,
        earnings,
        productsCount: productCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shop settings
// @route   PUT /api/seller/shop-settings
// @access  Private/Seller
exports.updateShopSettings = async (req, res) => {
  try {
    const { shopName, shopPhone, shopAddress, shopGST, shopDescription } = req.body;

    const user = await User.findById(req.user._id);

    if (shopName) user.shopName = shopName;
    if (shopPhone) user.shopPhone = shopPhone;
    if (shopAddress) user.shopAddress = shopAddress;
    if (shopGST) user.shopGST = shopGST;
    if (shopDescription) user.shopDescription = shopDescription;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Shop settings updated successfully',
      user: {
        shopName: user.shopName,
        shopPhone: user.shopPhone,
        shopAddress: user.shopAddress,
        shopGST: user.shopGST,
        shopDescription: user.shopDescription
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get pending seller applications (Admin)
// @route   GET /api/seller/admin/pending
// @access  Private/Admin
exports.getPendingSellers = async (req, res) => {
  try {
    const pendingSellers = await User.find({ sellerStatus: 'pending' }).select('-password');

    res.status(200).json({
      success: true,
      count: pendingSellers.length,
      sellers: pendingSellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject seller application (Admin)
// @route   PUT /api/seller/admin/:id/status
// @access  Private/Admin
exports.updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.sellerStatus = status;

    if (status === 'approved') {
      // Add 'seller' role if not already present
      if (!user.roles.includes('seller')) {
        user.roles.push('seller');
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Seller application ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        sellerStatus: user.sellerStatus,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all sellers (Admin)
// @route   GET /api/seller/admin/all
// @access  Private/Admin
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ roles: 'seller' }).select('-password');

    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
