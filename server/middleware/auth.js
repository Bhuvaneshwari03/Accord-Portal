const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to check if user has specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Middleware to check if user can access their own data or is admin/faculty
const authorizeOwnOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  const resourceUserId = req.params.userId || req.params.studentId || req.body.studentId;
  
  // Allow if user is admin or faculty
  if (['admin', 'faculty'].includes(req.user.role)) {
    return next();
  }

  // Allow if user is accessing their own data
  if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only access your own data.'
  });
};

// Middleware to check if user can manage leave requests
const canManageLeaves = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  // Only faculty and admin can manage leave requests
  if (!['faculty', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only faculty and admin can manage leave requests.'
    });
  }

  next();
};

// Middleware to validate request ownership for leave requests
const validateLeaveOwnership = async (req, res, next) => {
  try {
    const leaveId = req.params.id;
    const userId = req.user._id;

    // If user is admin or faculty, allow access
    if (['admin', 'faculty'].includes(req.user.role)) {
      return next();
    }

    // For students, check if they own the leave request
    const LeaveRequest = require('../models/LeaveRequest');
    const leaveRequest = await LeaveRequest.findById(leaveId);
    
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found.'
      });
    }

    if (leaveRequest.studentId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own leave requests.'
      });
    }

    next();
  } catch (error) {
    console.error('Leave ownership validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during ownership validation.'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnOrAdmin,
  canManageLeaves,
  validateLeaveOwnership
};
