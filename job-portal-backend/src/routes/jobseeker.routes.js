const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isJobseeker } = require('../middleware/roleCheck.middleware');
const { validateApplication } = require('../middleware/validation.middleware');
const { uploadResume: resumeUploadMiddleware } = require('../middleware/upload.middleware');

// Import controllers
const {
  getMyApplications,
  getApplicationDetails,
  withdrawApplication,
  applyForJob
} = require('../controllers/jobseeker/application.controller');

const {
  getProfile,
  updateProfile,
  uploadResume: handleResumeUpload,
  updateSkills,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/jobseeker/profile.controller');

const {
  searchJobs,
  getJobDetails,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getRecommendedJobs
} = require('../controllers/jobseeker/search.controller');

// Profile Routes
router.get('/profile', protect, isJobseeker, getProfile);
router.put('/profile', protect, isJobseeker, updateProfile);
router.post('/profile/resume', protect, isJobseeker, resumeUploadMiddleware, handleResumeUpload);
router.put('/profile/skills', protect, isJobseeker, updateSkills);

// Experience Routes
router.post('/profile/experience', protect, isJobseeker, addExperience);
router.put('/profile/experience/:id', protect, isJobseeker, updateExperience);
router.delete('/profile/experience/:id', protect, isJobseeker, deleteExperience);

// Education Routes
router.post('/profile/education', protect, isJobseeker, addEducation);
router.put('/profile/education/:id', protect, isJobseeker, updateEducation);
router.delete('/profile/education/:id', protect, isJobseeker, deleteEducation);

// Job Search Routes
router.get('/jobs/search', protect, isJobseeker, searchJobs);
router.get('/jobs/:id', protect, isJobseeker, getJobDetails);
router.get('/jobs/recommended', protect, isJobseeker, getRecommendedJobs);

// Saved Jobs Routes
router.get('/jobs/saved', protect, isJobseeker, getSavedJobs);
router.post('/jobs/:id/save', protect, isJobseeker, saveJob);
router.delete('/jobs/:id/save', protect, isJobseeker, unsaveJob);

// Application Routes
router.post('/jobs/:id/apply', protect, isJobseeker, validateApplication, applyForJob);
router.get('/applications', protect, isJobseeker, getMyApplications);
router.get('/applications/:id', protect, isJobseeker, getApplicationDetails);
router.delete('/applications/:id', protect, isJobseeker, withdrawApplication);

module.exports = router;
