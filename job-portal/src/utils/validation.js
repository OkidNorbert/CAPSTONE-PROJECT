/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Password validation regex patterns
 */
const PASSWORD_PATTERNS = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * URL validation regex pattern
 */
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Phone number validation regex pattern (US format)
 */
const PHONE_REGEX = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
};

/**
 * Validate a password against security requirements
 * @param {string} password - The password to validate
 * @returns {Object} Validation results for each requirement
 */
export const validatePassword = (password) => {
  return {
    minLength: PASSWORD_PATTERNS.minLength.test(password),
    hasUpperCase: PASSWORD_PATTERNS.hasUpperCase.test(password),
    hasLowerCase: PASSWORD_PATTERNS.hasLowerCase.test(password),
    hasNumber: PASSWORD_PATTERNS.hasNumber.test(password),
    hasSpecialChar: PASSWORD_PATTERNS.hasSpecialChar.test(password),
  };
};

/**
 * Check if a password meets all security requirements
 * @param {string} password - The password to check
 * @returns {boolean} Whether the password is valid
 */
export const isValidPassword = (password) => {
  const results = validatePassword(password);
  return Object.values(results).every(Boolean);
};

/**
 * Validate a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  return URL_REGEX.test(url);
};

/**
 * Validate a phone number (US format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  return PHONE_REGEX.test(phone);
};

/**
 * Validate required fields in an object
 * @param {Object} data - The object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} Validation results with error messages
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate the length of a string
 * @param {string} value - The string to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum length
 * @param {number} options.max - Maximum length
 * @returns {boolean} Whether the string length is valid
 */
export const isValidLength = (value, { min, max } = {}) => {
  const length = String(value).length;
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  return true;
};

/**
 * Validate a date string
 * @param {string} date - The date string to validate
 * @param {Object} options - Validation options
 * @param {Date} options.minDate - Minimum allowed date
 * @param {Date} options.maxDate - Maximum allowed date
 * @returns {boolean} Whether the date is valid
 */
export const isValidDate = (date, { minDate, maxDate } = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  
  if (minDate && d < new Date(minDate)) return false;
  if (maxDate && d > new Date(maxDate)) return false;
  
  return true;
};

/**
 * Validate a file
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {string[]} options.allowedTypes - Array of allowed MIME types
 * @returns {Object} Validation results
 */
export const validateFile = (file, { maxSize, allowedTypes } = {}) => {
  const errors = [];

  if (maxSize && file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate a number is within a range
 * @param {number} value - The number to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @returns {boolean} Whether the number is valid
 */
export const isValidNumber = (value, { min, max } = {}) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  
  return true;
};

/**
 * Create a form validator with custom validation rules
 * @param {Object} rules - Validation rules for each field
 * @returns {Function} Validator function that returns validation results
 */
export const createValidator = (rules) => {
  return (data) => {
    const errors = {};
    
    Object.entries(rules).forEach(([field, validations]) => {
      validations.forEach(({ rule, message }) => {
        if (!rule(data[field])) {
          errors[field] = message;
        }
      });
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
};
