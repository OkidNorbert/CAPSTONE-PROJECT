const crypto = require('crypto');

// Generate random token
const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

// Format date
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Calculate time difference
const getTimeDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Paginate results
const paginateResults = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit)
  };
};

// Sort options
const getSortOptions = (sortBy = 'createdAt', sortOrder = 'desc') => {
  return { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
};

// Filter empty fields from object
const filterEmptyFields = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Calculate experience level
const calculateExperienceLevel = (years) => {
  if (years < 2) return 'Entry Level';
  if (years < 5) return 'Mid Level';
  if (years < 8) return 'Senior Level';
  return 'Expert Level';
};

// Format salary range
const formatSalaryRange = (min, max, currency = 'USD', period = 'yearly') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });

  return `${formatter.format(min)} - ${formatter.format(max)} per ${period}`;
};

// Calculate application success rate
const calculateSuccessRate = (applications) => {
  if (!applications.length) return 0;
  const successful = applications.filter(app => app.status === 'accepted').length;
  return (successful / applications.length) * 100;
};

// Generate password reset token
const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  return {
    resetToken,
    hash,
    expires: Date.now() + 3600000 // 1 hour
  };
};

module.exports = {
  generateToken,
  formatDate,
  getTimeDifference,
  formatFileSize,
  generateSlug,
  paginateResults,
  getSortOptions,
  filterEmptyFields,
  calculateExperienceLevel,
  formatSalaryRange,
  calculateSuccessRate,
  generatePasswordResetToken
};
