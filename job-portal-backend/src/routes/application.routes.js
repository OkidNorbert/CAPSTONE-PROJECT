const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getJobApplications,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  scheduleInterview
} = require('../controllers/application.controller');

// Get all applications for current user
router.get('/me', protect, getMyApplications);

// Get application by ID
router.get('/:id', protect, getApplicationById);

// Update application status
router.put('/:id/status', protect, updateApplicationStatus);

// Add note to application
router.post('/:id/notes', protect, addApplicationNote);

// Schedule interview
router.post('/:id/interview', protect, scheduleInterview);

module.exports = router; 