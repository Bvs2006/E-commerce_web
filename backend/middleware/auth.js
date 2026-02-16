const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - authenticate user
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    const hasRole = roles.some(role => req.user.roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.roles.join(', ')}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Seller authorization - check if user is approved seller
exports.authorizeSeller = async (req, res, next) => {
  try {
    if (!req.user.roles.includes('seller')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as seller'
      });
    }

    if (req.user.sellerStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Seller account not approved yet'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in seller authorization'
    });
  }
};

// Check if user owns the resource (for sellers modifying their own products)
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${model}`);
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${model} not found`
        });
      }

      // Check if user is the seller of this resource or admin
      if (resource.seller.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error in ownership check'
      });
    }
  };
};
