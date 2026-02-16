const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      couponCode
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Calculate admin commission (10% of total)
    const adminCommission = totalPrice * 0.1;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
      couponCode,
      adminCommission
    });

    // Update product sold count and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.soldCount += item.quantity;
        product.stock -= item.quantity;
        await product.save();
      }

      // Update seller earnings (90% of item price)
      const sellerEarning = item.price * item.quantity * 0.9;
      await User.findByIdAndUpdate(item.seller, {
        $inc: { earnings: sellerEarning }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images')
      .populate('orderItems.seller', 'shopName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      // Check if user is seller of any item in this order
      const isSeller = order.orderItems.some(
        item => item.seller.toString() === req.user._id.toString()
      );

      if (!isSeller) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order'
        });
      }
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get seller orders
// @route   GET /api/orders/seller/my-orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    // Find orders that contain products from this seller
    const orders = await Order.find({
      'orderItems.seller': req.user._id
    })
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (Seller)
// @route   PUT /api/orders/:id/status
// @access  Private/Seller
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if seller is authorized
    const isSeller = order.orderItems.some(
      item => item.seller.toString() === req.user._id.toString()
    );

    if (!isSeller && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('orderItems.seller', 'shopName');

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
