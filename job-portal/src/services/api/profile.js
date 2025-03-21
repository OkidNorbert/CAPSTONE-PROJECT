import api from './api';

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/jobseeker/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (formData) => {
  const response = await api.put('/jobseeker/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Upload resume
export const uploadResume = async (formData) => {
  try {
    const response = await api.post('/jobseeker/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Resume upload response:', response.data); // Debug log
    
    // Check for various possible response formats
    const resumeData = {
      resumeUrl: response.data.resumeUrl || response.data.resume || response.data.url,
      resumeId: response.data.id || response.data.resumeId || response.data._id,
      message: response.data.message
    };
    
    // If we still don't have a resumeId, try to extract it from the URL
    if (!resumeData.resumeId && resumeData.resumeUrl) {
      const urlParts = resumeData.resumeUrl.split('/');
      const possibleId = urlParts[urlParts.length - 1].split('.')[0];
      if (possibleId) {
        resumeData.resumeId = possibleId;
      }
    }
    
    if (!resumeData.resumeUrl) {
      throw new Error('No resume URL received from server');
    }
    
    if (!resumeData.resumeId) {
      // If we still don't have an ID, generate one from the timestamp
      resumeData.resumeId = `resume_${Date.now()}`;
    }
    
    return resumeData;
  } catch (error) {
    console.error('Error uploading resume:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Delete resume
export const deleteResume = async (resumeId) => {
  try {
    const response = await api.delete(`/jobseeker/profile/resume/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Get user resumes
export const getUserResumes = async () => {
  try {
    const response = await api.get('/jobseeker/profile/resumes');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data :
           response.data.resumes ? response.data.resumes :
           [];
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
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

// Upload profile picture
export const uploadProfilePicture = async (formData) => {
  try {
    const response = await api.post('/jobseeker/profile/picture', formData, {
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
    console.error('Error uploading profile picture:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// Upload employer profile picture
export const uploadEmployerProfilePicture = async (formData) => {
  try {
    const response = await api.post('/employer/profile/picture', formData, {
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
    console.error('Error uploading profile picture:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};