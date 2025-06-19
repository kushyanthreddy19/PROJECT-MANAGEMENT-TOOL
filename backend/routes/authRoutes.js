const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { route } = require('./userRoutes');

// Optional auth middleware
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
}

router.post('/register', optionalAuth, register);
router.post('/login', login);

module.exports = router;