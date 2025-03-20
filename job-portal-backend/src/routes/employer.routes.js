const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isEmployer } = require('../middleware/roleCheck.middleware');
const { validateJobPosting, validateCompanyProfile } = require('../middleware/validation.middleware');
const { uploadCompanyLogo } = require('../middleware/upload.middleware');


// Import controllers
const {
  getApplications,
  updateApplicationStatus,
  scheduleInterview,
  addNote
} = require('../controllers/employer/application.controller');

const {
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
  getJobApplications
} = require('../controllers/employer/job.controller');

const {
  getCompanyProfile,
  updateCompanyProfile,
  updateCompanySettings,
  uploadLogo: handleLogoUpload
} = require('../controllers/employer/profile.controller');

const {
  getDashboardStats,
  getRecentApplications
} = require('../controllers/employer/dashboard.controller');

// Dashboard Routes
router.get('/dashboard/stats', protect, isEmployer, getDashboardStats);
router.get('/dashboard/recent-applications', protect, isEmployer, getRecentApplications);

// Profile Routes
router.get('/profile', protect, isEmployer, getCompanyProfile);
router.put('/profile', protect, isEmployer, validateCompanyProfile, updateCompanyProfile);
router.post('/profile/logo', protect, isEmployer, uploadCompanyLogo, handleLogoUpload);
router.put('/settings', protect, isEmployer, updateCompanySettings);

// Job Management Routes
router.post('/jobs', protect, isEmployer, validateJobPosting, createJob);
router.put('/jobs/:id', protect, isEmployer, validateJobPosting, updateJob);
router.delete('/jobs/:id', protect, isEmployer, deleteJob);
router.get('/jobs', protect, isEmployer, getCompanyJobs);
router.get('/jobs/:id/applications', protect, isEmployer, getJobApplications);

// Application Management Routes
router.get('/applications', protect, isEmployer, getApplications);
router.put('/applications/:id/status', protect, isEmployer, updateApplicationStatus);
router.post('/applications/:id/interview', protect, isEmployer, scheduleInterview);
router.post('/applications/:id/notes', protect, isEmployer, addNote);

module.exports = router;

