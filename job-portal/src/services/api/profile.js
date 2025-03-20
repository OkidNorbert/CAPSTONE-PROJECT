import api from './api';

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/jobseeker/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/jobseeker/profile', profileData);
  return response.data;
};

// Upload resume
export const uploadResume = async (formData) => {
  const response = await api.post('/jobseeker/profile/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete resume
export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/jobseeker/profile/resume/${resumeId}`);
  return response.data;
};

// Get user resumes
export const getUserResumes = async () => {
  const response = await api.get('/jobseeker/profile/resumes');
  return response.data;
};

// Update skills
export const updateSkills = async (skills) => {
  const response = await api.put('/jobseeker/profile/skills', { skills });
  return response.data;
};

// Add experience
export const addExperience = async (experienceData) => {
  const response = await api.post('/jobseeker/profile/experience', experienceData);
  return response.data;
};

// Update experience
export const updateExperience = async (experienceId, experienceData) => {
  const response = await api.put(`/jobseeker/profile/experience/${experienceId}`, experienceData);
  return response.data;
};

// Delete experience
export const deleteExperience = async (experienceId) => {
  const response = await api.delete(`/jobseeker/profile/experience/${experienceId}`);
  return response.data;
};

// Add education
export const addEducation = async (educationData) => {
  const response = await api.post('/jobseeker/profile/education', educationData);
  return response.data;
};

// Update education
export const updateEducation = async (educationId, educationData) => {
  const response = await api.put(`/jobseeker/profile/education/${educationId}`, educationData);
  return response.data;
};

// Delete education
export const deleteEducation = async (educationId) => {
  const response = await api.delete(`/jobseeker/profile/education/${educationId}`);
  return response.data;
};