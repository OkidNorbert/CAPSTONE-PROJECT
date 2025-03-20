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
    
    if (!response.data || !response.data.profilePictureUrl) {
      throw new Error('Invalid response format from server');
    }
    
    return {
      profilePictureUrl: response.data.profilePictureUrl,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error uploading admin profile picture:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}; 