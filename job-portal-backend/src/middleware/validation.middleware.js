const validator = require('validator');

// Validate registration data
exports.validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;
  const errors = [];

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Name validation
  if (!firstName || firstName.trim().length < 2) {
    errors.push('First name is required and must be at least 2 characters');
  }
  if (!lastName || lastName.trim().length < 2) {
    errors.push('Last name is required and must be at least 2 characters');
  }

  // Role validation
  if (role && !['jobseeker', 'employer'].includes(role)) {
    errors.push('Invalid role specified');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Validate job posting data
exports.validateJobPosting = (req, res, next) => {
  const { 
    title, 
    location, 
    type, 
    description, 
    requirements, 
    responsibilities, 
    experienceMin, 
    experienceMax, 
    salaryMin, 
    salaryMax 
  } = req.body;
  const errors = [];

  // Title validation
  if (!title || title.trim().length < 3) {
    errors.push('Job title is required and must be at least 3 characters');
  }

  // Location validation
  if (!location || location.trim().length < 2) {
    errors.push('Job location is required');
  }

  // Type validation
  if (!type || !['full-time', 'part-time', 'contract', 'internship'].includes(type)) {
    errors.push('Invalid job type');
  }

  // Description validation
  if (!description || description.trim().length < 50) {
    errors.push('Job description must be at least 50 characters');
  }

  // Requirements validation
  if (!requirements || requirements.trim().length < 30) {
    errors.push('Job requirements must be at least 30 characters');
  }

  // Responsibilities validation
  if (!responsibilities || responsibilities.trim().length < 30) {
    errors.push('Job responsibilities must be at least 30 characters');
  }

  // Experience validation
  if (!experienceMin || !experienceMax || parseInt(experienceMin) > parseInt(experienceMax)) {
    errors.push('Invalid experience range');
  }

  // Salary validation
  if (!salaryMin || !salaryMax || parseInt(salaryMin) > parseInt(salaryMax)) {
    errors.push('Invalid salary range');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Validate application data
exports.validateApplication = (req, res, next) => {
  const { resumePath, coverLetter } = req.body;
  const errors = [];

  if (!resumePath) {
    errors.push('Resume path is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Validate profile update data
exports.validateProfileUpdate = (req, res, next) => {
  const { email, firstName, lastName, phone } = req.body;
  const errors = [];

  if (email && !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (firstName && firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  if (lastName && lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  if (phone && !validator.isMobilePhone(phone)) {
    errors.push('Please provide a valid phone number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Validate company profile data
exports.validateCompanyProfile = (req, res, next) => {
  const { companyName, industry, website } = req.body;
  const errors = [];

  if (!companyName || companyName.trim().length < 2) {
    errors.push('Company name is required and must be at least 2 characters');
  }

  if (!industry || industry.trim().length < 2) {
    errors.push('Industry is required');
  }

  if (website && !validator.isURL(website)) {
    errors.push('Please provide a valid website URL');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
