<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserResumes } from '../../../services/api/profile';
import { applyForJob } from '../../../services/api/jobs';

const JobApplication = ({ jobId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getUserResumes();
      setResumes(data);
      if (data.length > 0) {
        setSelectedResumeId(data[0].id);
      }
    } catch (error) {
      toast.error('Could not load your resumes. Please try again.');
    } finally {
      setLoading(false);
    }
=======
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { applyForJob } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const JobApplication = ({ jobId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    resumePath: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
<<<<<<< HEAD
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }

    try {
      setSubmitting(true);
      await applyForJob(jobId, { resumeId: selectedResumeId });
      toast.success('Application submitted successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (resumes.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="body1" gutterBottom>
          You need to upload a resume before applying for jobs.
        </Typography>
        <Button
          component={Link}
          to="/profile/resumes"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Upload Resume
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="resume-select-label">Select Resume</InputLabel>
        <Select
          labelId="resume-select-label"
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
          label="Select Resume"
          required
        >
          {resumes.map((resume) => (
            <MenuItem key={resume.id} value={resume.id}>
              {resume.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          component={Link}
          to="/profile/resumes"
          color="primary"
        >
          Manage Resumes
        </Button>
        <Box>
          <Button
            onClick={onCancel}
            sx={{ mr: 2 }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        </Box>
      </Box>
    </Box>
=======
    if (!formData.resumePath.trim()) {
      toast.error('Please provide a resume path');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await applyForJob(jobId, formData);
      toast.success('Application submitted successfully!');
      if (onSuccess) onSuccess(response);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "glass-effect p-6 rounded-2xl",
      "hover-effect"
    )}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Apply for this Job
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resume Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="resumePath"
            value={formData.resumePath}
            onChange={handleChange}
            placeholder="Enter the path to your resume"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please upload your resume first in your profile and then provide the path here.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Write a cover letter explaining why you're a good fit for this position..."
            rows={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
  );
};

export default JobApplication; 