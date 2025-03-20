import React, { useState, useEffect } from 'react';
import { getUserResumes, deleteResume } from '../../../services/api/profile';
import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ResumeList = ({ onResumeDeleted }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getUserResumes();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (resumeId) => {
    try {
      await deleteResume(resumeId);
      toast.success('Resume deleted successfully');
      fetchResumes();
      if (onResumeDeleted) {
        onResumeDeleted(resumeId);
      }
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (resumes.length === 0) {
    return (
      <Box textAlign="center" p={2}>
        <Typography color="textSecondary">
          No resumes uploaded yet
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {resumes.map((resume) => (
        <ListItem
          key={resume.id}
          sx={{
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 1,
            mb: 1,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <DescriptionIcon sx={{ mr: 2, color: 'primary.main' }} />
          <ListItemText
            primary={resume.name}
            secondary={new Date(resume.uploadedAt).toLocaleDateString()}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(resume.id)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ResumeList;
