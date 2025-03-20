const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isEmployer, isJobseeker } = require('../middleware/roleCheck.middleware');
const { validateJobPosting, validateApplication } = require('../middleware/validation.middleware');

// Import controllers
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob
} = require('../controllers/job.controller');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Employer routes
router.post('/', protect, isEmployer, validateJobPosting, createJob);
router.put('/:id', protect, isEmployer, validateJobPosting, updateJob);
router.delete('/:id', protect, isEmployer, deleteJob);

// Jobseeker routes
router.post('/:id/apply', protect, isJobseeker, validateApplication, applyForJob);

module.exports = router; 