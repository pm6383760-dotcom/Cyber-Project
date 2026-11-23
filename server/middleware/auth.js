const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'phishguard_ai_cybersecurity_jwt_secret_2026_secure_key';

// Protect routes requiring authentication
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Security authentication token required.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please re-authenticate.'
    });
  }
};

// Optional auth - if token is present, populate req.user, else continue as guest
const optionalAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignore token parsing failure for optional routes
    }
  }
  next();
};

module.exports = {
  protect,
  optionalAuth
};
