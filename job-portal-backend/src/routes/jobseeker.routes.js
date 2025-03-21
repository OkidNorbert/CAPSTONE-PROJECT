const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { isJobseeker } = require('../middleware/roleCheck.middleware');
const { validateApplication } = require('../middleware/validation.middleware');
const { 
  uploadResume,
  uploadProfilePicture 
} = require('../middleware/upload.middleware');

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
  uploadProfilePicture: handleProfilePictureUpload,
  updatePreferences,
  updateSocialLinks,
  getResumes
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
router.put('/profile', protect, isJobseeker, uploadProfilePicture, updateProfile);
router.get('/profile/resumes', protect, isJobseeker, getResumes);
router.post('/profile/resume', protect, isJobseeker, uploadResume, handleResumeUpload);
router.post('/profile/picture', protect, isJobseeker, uploadProfilePicture, handleProfilePictureUpload);
router.put('/profile/preferences', protect, isJobseeker, updatePreferences);
router.put('/profile/social-links', protect, isJobseeker, updateSocialLinks);

// Job Search Routes
router.get('/jobs/search', protect, isJobseeker, searchJobs);
router.get('/jobs/recommended', protect, isJobseeker, getRecommendedJobs);
router.get('/jobs/:id', protect, isJobseeker, getJobDetails);

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
