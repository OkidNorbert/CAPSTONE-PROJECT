import api from './api';

// Get admin profile
export const getAdminProfile = async () => {
  try {
    const response = await api.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

// Update admin profile
export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.put('/admin/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

// Upload admin profile picture
export const uploadAdminProfilePicture = async (formData) => {
  try {
    const response = await api.post('/admin/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading admin profile picture:', error);
    throw error;
  }
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// User Management
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Job Management
export const getAdminJobs = async (params = {}) => {
  try {
    const response = await api.get('/admin/jobs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const updateJobStatus = async (jobId, status) => {
  try {
    const response = await api.patch(`/admin/jobs/${jobId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

export const toggleJobFeatured = async (jobId, featured) => {
  try {
    const response = await api.patch(`/admin/jobs/${jobId}/featured`, { featured });
    return response.data;
  } catch (error) {
    console.error('Error toggling job featured status:', error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// System Configuration
export const getSystemConfig = async () => {
  try {
    const response = await api.get('/admin/system/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching system config:', error);
    throw error;
  }
};

export const updateSystemConfig = async (category, config) => {
  try {
    const response = await api.put(`/admin/system/config/${category}`, config);
    return response.data;
  } catch (error) {
    console.error('Error updating system config:', error);
    throw error;
  }
};

// Job Categories
export const getJobCategories = async () => {
  try {
    const response = await api.get('/admin/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching job categories:', error);
    throw error;
  }
};

export const addJobCategory = async (categoryData) => {
  try {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding job category:', error);
    throw error;
  }
};

export const updateJobCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating job category:', error);
    throw error;
  }
};

export const deleteJobCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job category:', error);
    throw error;
  }
}; 