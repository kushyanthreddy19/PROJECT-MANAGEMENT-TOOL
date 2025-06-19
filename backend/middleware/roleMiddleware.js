// middleware/roleMiddleware.js
module.exports = function(requiredRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    // Allow if user role is in the requiredRoles array
    if (requiredRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
  };
};
