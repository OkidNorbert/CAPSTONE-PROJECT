import axios from 'axios';

// Get user profile
export const getUserProfile = async () => {
  const response = await axios.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await axios.put('/users/profile', profileData);
  return response.data;
};

// Upload resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await axios.post('/users/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const response = await axios.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update skills
export const updateSkills = async (skills) => {
  const response = await axios.put('/users/skills', { skills });
  return response.data;
};

// Add experience
export const addExperience = async (experienceData) => {
  const response = await axios.post('/users/experience', experienceData);
  return response.data;
};

// Update experience
export const updateExperience = async (experienceId, experienceData) => {
  const response = await axios.put(`/users/experience/${experienceId}`, experienceData);
  return response.data;
};

// Delete experience
export const deleteExperience = async (experienceId) => {
  const response = await axios.delete(`/users/experience/${experienceId}`);
  return response.data;
};

// Add education
export const addEducation = async (educationData) => {
  const response = await axios.post('/users/education', educationData);
  return response.data;
};

// Update education
export const updateEducation = async (educationId, educationData) => {
  const response = await axios.put(`/users/education/${educationId}`, educationData);
  return response.data;
};

// Delete education
export const deleteEducation = async (educationId) => {
  const response = await axios.delete(`/users/education/${educationId}`);
  return response.data;
}; 