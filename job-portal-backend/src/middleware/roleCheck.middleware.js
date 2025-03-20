const User = require('../models/user.model');

// Check if user has required role
exports.checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Role ${user.role} is not authorized to access this route`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

// Check if user is an employer
exports.isEmployer = (req, res, next) => {
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Employer role required.' });
  }
  next();
};

// Check if user is a jobseeker
exports.isJobseeker = (req, res, next) => {
  if (!req.user || req.user.role !== 'jobseeker') {
    return res.status(403).json({ message: 'Access denied. Jobseeker role required.' });
  }
  next();
};

// Check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};
