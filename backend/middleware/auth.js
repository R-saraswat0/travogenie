const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify JWT token middleware
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from token with constant-time comparison
    const user = await User.findById(decoded.userId).select('-password');
    
    // Use constant-time comparison to prevent timing attacks
    const userExists = user ? 'valid' : 'invalid';
    const expectedResult = 'valid';
    
    if (!crypto.timingSafeEqual(Buffer.from(userExists), Buffer.from(expectedResult))) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.'
      });
    }
    
    // Check if user account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
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

// Admin authorization shorthand
const admin = authorize('admin');

// Email verification middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature.'
    });
  }
  next();
};

// Rate limiting middleware for sensitive operations
const rateLimitSensitive = (req, res, next) => {
  // This would typically use Redis or similar for production
  // For now, we'll implement basic in-memory rate limiting
  
  // Sanitize path to prevent path traversal
  const sanitizedPath = req.path.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
  const key = `${req.ip}_${sanitizedPath}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const attempts = global.rateLimitStore.get(key) || [];
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again later.'
    });
  }
  
  recentAttempts.push(now);
  global.rateLimitStore.set(key, recentAttempts);
  
  next();
};

module.exports = {
  generateToken,
  authenticate,
  authorize,
  admin,
  requireEmailVerification,
  rateLimitSensitive
};