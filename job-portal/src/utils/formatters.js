/**
 * Format a date to a human-readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @param {string} options.format - The format to use ('full', 'short', 'relative')
 * @returns {string} The formatted date string
 */
export const formatDate = (date, { format = 'full' } = {}) => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  switch (format) {
    case 'full':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'short':
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    
    case 'relative':
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 60) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 30) return `${days}d ago`;
      if (months < 12) return `${months}mo ago`;
      return `${years}y ago`;

    default:
      return d.toLocaleDateString();
  }
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a number to a currency string
 * @param {number} amount - The amount to format
 * @param {Object} options - Formatting options
 * @param {string} options.currency - The currency code (default: 'USD')
 * @param {string} options.locale - The locale to use (default: 'en-US')
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, { currency = 'USD', locale = 'en-US' } = {}) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Text formatters
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format a number with appropriate suffixes (K, M, B)
 * @param {number} number - The number to format
 * @param {Object} options - Formatting options
 * @param {number} options.decimals - Number of decimal places (default: 1)
 * @returns {string} The formatted number string
 */
export const formatNumber = (number, { decimals = 1 } = {}) => {
  if (number === null || number === undefined) return '0';
  
  if (Math.abs(number) >= 1000000000) {
    return (number / 1000000000).toFixed(decimals) + 'B';
  }
  if (Math.abs(number) >= 1000000) {
    return (number / 1000000).toFixed(decimals) + 'M';
  }
  if (Math.abs(number) >= 1000) {
    return (number / 1000).toFixed(decimals) + 'K';
  }
  return number.toString();
};

/**
 * Format a file size in bytes to a human-readable string
 * @param {number} bytes - The file size in bytes
 * @param {Object} options - Formatting options
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @returns {string} The formatted file size string
 */
export const formatFileSize = (bytes, { decimals = 2 } = {}) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format a duration in milliseconds to a human-readable string
 * @param {number} ms - The duration in milliseconds
 * @param {Object} options - Formatting options
 * @param {boolean} options.short - Whether to use short format (default: false)
 * @returns {string} The formatted duration string
 */
export const formatDuration = (ms, { short = false } = {}) => {
  if (!ms) return short ? '0s' : '0 seconds';

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];

  if (days > 0) {
    parts.push(short ? `${days}d` : `${days} day${days === 1 ? '' : 's'}`);
  }
  if (hours > 0) {
    parts.push(short ? `${hours}h` : `${hours} hour${hours === 1 ? '' : 's'}`);
  }
  if (minutes > 0) {
    parts.push(short ? `${minutes}m` : `${minutes} minute${minutes === 1 ? '' : 's'}`);
  }
  if (seconds > 0) {
    parts.push(short ? `${seconds}s` : `${seconds} second${seconds === 1 ? '' : 's'}`);
  }

  return parts.join(short ? ' ' : ', ');
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {Object} options - Truncation options
 * @param {number} options.length - Maximum length (default: 100)
 * @param {string} options.suffix - Suffix to add (default: '...')
 * @returns {string} The truncated text
 */
export const truncateText = (text, { length = 100, suffix = '...' } = {}) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
};

/**
 * Format a phone number to a standard format
 * @param {string} phone - The phone number to format
 * @param {Object} options - Formatting options
 * @param {string} options.format - The format to use ('international', 'national')
 * @returns {string} The formatted phone number
 */
export const formatPhoneNumber = (phone, { format = 'national' } = {}) => {
  if (!phone) return '';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  if (format === 'international') {
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  } else {
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
  }

  return phone; // Return original if format not recognized
};

/**
 * Format a string to title case
 * @param {string} text - The text to format
 * @returns {string} The formatted text in title case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a string to slug case
 * @param {string} text - The text to format
 * @returns {string} The formatted text in slug case
 */
export const toSlugCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};
