// You can replace this with your preferred notification library (e.g., react-toastify, react-hot-toast)
const defaultOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccess = (message, options = {}) => {
  console.log('Success:', message);
  // Implement your notification logic here
  // toast.success(message, { ...defaultOptions, ...options });
};

export const showError = (message, options = {}) => {
  console.error('Error:', message);
  // Implement your notification logic here
  // toast.error(message, { ...defaultOptions, ...options });
};

export const showInfo = (message, options = {}) => {
  console.info('Info:', message);
  // Implement your notification logic here
  // toast.info(message, { ...defaultOptions, ...options });
};

export const showWarning = (message, options = {}) => {
  console.warn('Warning:', message);
  // Implement your notification logic here
  // toast.warning(message, { ...defaultOptions, ...options });
};

// Handle API errors
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  showError(message);
  return message;
};

// Handle form submission success
export const handleFormSuccess = (message = 'Changes saved successfully') => {
  showSuccess(message);
};

// Handle form submission error
export const handleFormError = (error) => {
  const message = error.response?.data?.message || error.message || 'Form submission failed';
  showError(message);
  return message;
}; 