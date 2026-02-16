const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Withdrawal = require('../models/Withdrawal');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    // Count users
    const usersCount = await User.countDocuments({ roles: { $nin: ['admin'] } });

    // Count sellers
    const sellersCount = await User.countDocuments({ roles: 'seller' });

    // Count products
    const productsCount = await Product.countDocuments();

    // Count orders
    const ordersCount = await Order.countDocuments();

    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Calculate admin commission
    const adminCommission = orders.reduce((acc, order) => acc + order.adminCommission, 0);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name email');

    // Pending seller applications
    const pendingSellersCount = await User.countDocuments({ sellerStatus: 'pending' });

    res.status(200).json({
      success: true,
      stats: {
        usersCount,
        sellersCount,
        productsCount,
        ordersCount,
        totalRevenue,
        adminCommission,
        pendingSellersCount
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Orders analytics
    const orders = await Order.find({ createdAt: { $gte: daysAgo } });
    
    const ordersByDay = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!ordersByDay[date]) {
        ordersByDay[date] = { count: 0, revenue: 0 };
      }
      ordersByDay[date].count++;
      ordersByDay[date].revenue += order.totalPrice;
    });

    // Category analytics
    const products = await Product.find();
    const categoryStats = {};
    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { count: 0, soldCount: 0 };
      }
      categoryStats[product.category].count++;
      categoryStats[product.category].soldCount += product.soldCount;
    });

    // Top sellers
    const topSellers = await User.find({ roles: 'seller' })
      .sort('-earnings')
      .limit(10)
      .select('name shopName earnings');

    res.status(200).json({
      success: true,
      analytics: {
        ordersByDay,
        categoryStats,
        topSellers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
exports.getWithdrawals = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const withdrawals = await Withdrawal.find(query)
      .populate('seller', 'name shopName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update withdrawal status
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = Date.now();

    await withdrawal.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal status updated successfully',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
