const Coupon = require('../models/Coupon');

// @desc    Create coupon (Seller)
// @route   POST /api/coupons
// @access  Private/Seller
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, minPurchase, maxDiscount, expiryDate, usageLimit } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      seller: req.user._id,
      minPurchase,
      maxDiscount,
      expiryDate,
      usageLimit
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get seller's coupons
// @route   GET /api/coupons/seller/my-coupons
// @access  Private/Seller
exports.getSellerCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ seller: req.user._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply coupon
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired or reached usage limit'
      });
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required`
      });
    }

    // Check if user already used this coupon
    const alreadyUsed = coupon.usedBy.some(
      userId => userId.toString() === req.user._id.toString()
    );

    if (alreadyUsed) {
      return res.status(400).json({
        success: false,
        message: 'You have already used this coupon'
      });
    }

    // Calculate discount
    let discountAmount = (cartTotal * coupon.discount) / 100;

    // Apply max discount limit if exists
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      discount: discountAmount,
      coupon: {
        code: coupon.code,
        discount: coupon.discount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark coupon as used
// @route   POST /api/coupons/:code/use
// @access  Private
exports.useCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Add user to usedBy array
    if (!coupon.usedBy.includes(req.user._id)) {
      coupon.usedBy.push(req.user._id);
      await coupon.save();
    }

    res.status(200).json({
      success: true,
      message: 'Coupon marked as used'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete coupon (Seller)
// @route   DELETE /api/coupons/:id
// @access  Private/Seller
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check ownership
    if (coupon.seller.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this coupon'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle coupon active status
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Seller
exports.toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check ownership
    if (coupon.seller.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this coupon'
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
