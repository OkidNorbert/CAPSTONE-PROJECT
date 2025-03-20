import api from './api';

// Get all jobs with filters
export const getJobs = async (filters = {}) => {
  const response = await api.get('/jobs', { params: filters });
  return response.data;
};

// Get single job by ID
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Create new job
export const createJob = async (jobData) => {
  const response = await api.post('/employer/jobs', jobData);
  return response.data;
};

// Update job
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/employer/jobs/${jobId}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/employer/jobs/${jobId}`);
  return response.data;
};

// Apply for job
export const applyForJob = async (jobId, applicationData) => {
  const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
  return response.data;
};

// Get job applications
export const getJobApplications = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/applications`);
  return response.data;
};

// Update application status
export const updateApplicationStatus = async (jobId, applicationId, status) => {
  const response = await api.put(`/jobs/${jobId}/applications/${applicationId}`, { status });
  return response.data;
};

// Get my applications (for job seeker)
export const getMyApplications = async () => {
  const response = await api.get('/jobseeker/applications');
  return response.data;
};

// Get employer jobs
export const getEmployerJobs = async () => {
  const response = await api.get('/employer/jobs');
  return response.data;
}; 