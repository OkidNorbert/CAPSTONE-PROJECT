import api from './api';

// Get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get('/employer/dashboard/stats');
  return response.data;
};

// Get recent applications
export const getRecentApplications = async () => {
  const response = await api.get('/employer/dashboard/recent-applications');
  return response.data;
};

// Get company profile
export const getCompanyProfile = async () => {
  const response = await api.get('/employer/profile');
  return response.data;
};

// Update company profile
export const updateCompanyProfile = async (profileData) => {
  const response = await api.put('/employer/profile', profileData);
  return response.data;
};

// Upload company logo
export const uploadCompanyLogo = async (formData) => {
  const response = await api.post('/employer/profile/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}; 