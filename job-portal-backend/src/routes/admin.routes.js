const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/roleCheck.middleware');
const bcrypt = require('bcryptjs');
const { uploadProfilePicture } = require('../middleware/upload.middleware');

// Import controllers
const {
  getDashboardStats,
  getUserManagement,
  getSystemConfig,
  updateSystemConfig,
  getReports,
  manageCategories
} = require('../controllers/admin/system.controller');

const {
  getUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser
} = require('../controllers/admin/userManagement.controller');

const {
  getActivityReport,
  getJobReport,
  getUserReport,
  getFinancialReport,
  exportReport
} = require('../controllers/admin/report.controller');

const {
  getProfile,
  updateProfile,
  uploadProfilePicture: uploadPicture
} = require('../controllers/admin/profile.controller');

const {
  getJobs,
  updateJobStatus,
  deleteJob
} = require('../controllers/admin/jobManagement.controller');

// Dashboard and System Routes
router.get('/dashboard/stats', protect, isAdmin, getDashboardStats);
router.get('/system/config', protect, isAdmin, getSystemConfig);
router.put('/system/config', protect, isAdmin, updateSystemConfig);

// User Management Routes
router.get('/users', protect, isAdmin, getUsers);
router.get('/users/:id', protect, isAdmin, getUserDetails);
router.put('/users/:id/status', protect, isAdmin, updateUserStatus);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Job Management Routes
router.get('/jobs', protect, isAdmin, getJobs);
router.put('/jobs/:id/status', protect, isAdmin, updateJobStatus);
router.delete('/jobs/:id', protect, isAdmin, deleteJob);

// Category Management Routes
router.get('/categories', protect, isAdmin, manageCategories);
router.post('/categories', protect, isAdmin, manageCategories);
router.put('/categories/:id', protect, isAdmin, manageCategories);
router.delete('/categories/:id', protect, isAdmin, manageCategories);

// Report Routes
router.get('/reports/activity', protect, isAdmin, getActivityReport);
router.get('/reports/jobs', protect, isAdmin, getJobReport);
router.get('/reports/users', protect, isAdmin, getUserReport);
router.get('/reports/financial', protect, isAdmin, getFinancialReport);
router.get('/reports/export/:type', protect, isAdmin, exportReport);

// Change Password Route
router.put('/change-password', protect, isAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get admin user
    const admin = await User.findById(req.user.id).select('+password');
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profile Routes
router.get('/profile', protect, isAdmin, getProfile);
router.put('/profile', protect, isAdmin, updateProfile);
router.post('/profile/picture', protect, isAdmin, uploadProfilePicture, uploadPicture);

module.exports = router;
