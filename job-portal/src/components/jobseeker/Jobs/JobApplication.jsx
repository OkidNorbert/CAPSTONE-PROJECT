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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
  );
};

export default JobApplication; 