import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ResumeUpload from '../../components/jobseeker/Profile/ResumeUpload';
import ResumeList from '../../components/jobseeker/Profile/ResumeList';

const ProfileResumes = () => {
  const handleUploadSuccess = () => {
    // Refresh the resume list component
    const resumeListComponent = document.querySelector('#resume-list');
    if (resumeListComponent) {
      resumeListComponent.dispatchEvent(new CustomEvent('refresh'));
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Manage Resumes
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Upload and manage your resumes. You can upload multiple resumes and choose which one to use when applying for jobs.
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Upload New Resume
          </Typography>
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Resumes
          </Typography>
          <Box id="resume-list">
            <ResumeList />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileResumes;
