const validator = require('validator');

// Validate email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password
const isValidPassword = (password) => {
  return password.length >= 6;
};

// Validate URL
const isValidUrl = (url) => {
  return validator.isURL(url);
};

// Validate phone number
const isValidPhone = (phone) => {
  return validator.isMobilePhone(phone);
};

// Validate required fields
const validateRequired = (data, fields) => {
  const errors = [];
  fields.forEach(field => {
    if (!data[field] || validator.isEmpty(data[field].toString())) {
      errors.push(`${field} is required`);
    }
  });
  return errors;
};

// Validate file
const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = []
  } = options;

  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  if (file.size > maxSize) {
    errors.push(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
  }

  if (allowedTypes.length && !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return errors;
};

// Validate job posting
const validateJobPosting = (data) => {
  const errors = [];
  const requiredFields = [
    'title',
    'location',
    'type',
    'description',
    'requirements',
    'responsibilities'
  ];

  // Check required fields
  const missingFields = validateRequired(data, requiredFields);
  errors.push(...missingFields);

  // Validate experience range
  if (data.experience) {
    if (data.experience.min > data.experience.max) {
      errors.push('Minimum experience cannot be greater than maximum experience');
    }
  }

  // Validate salary range
  if (data.salary) {
    if (data.salary.min > data.salary.max) {
      errors.push('Minimum salary cannot be greater than maximum salary');
    }
  }

  return errors;
};

// Validate application
const validateApplication = (data) => {
  const errors = [];
  const requiredFields = ['resume'];

  // Check required fields
  const missingFields = validateRequired(data, requiredFields);
  errors.push(...missingFields);

  return errors;
};

// Validate company profile
const validateCompanyProfile = (data) => {
  const errors = [];
  const requiredFields = ['name', 'industry'];

  // Check required fields
  const missingFields = validateRequired(data, requiredFields);
  errors.push(...missingFields);

  // Validate website if provided
  if (data.website && !isValidUrl(data.website)) {
    errors.push('Invalid website URL');
  }

  return errors;
};

// Validate user profile
const validateUserProfile = (data) => {
  const errors = [];
  const requiredFields = ['firstName', 'lastName'];

  // Check required fields
  const missingFields = validateRequired(data, requiredFields);
  errors.push(...missingFields);

  // Validate email if provided
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email address');
  }

  // Validate phone if provided
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone number');
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUrl,
  isValidPhone,
  validateRequired,
  validateFile,
  validateJobPosting,
  validateApplication,
  validateCompanyProfile,
  validateUserProfile
};



