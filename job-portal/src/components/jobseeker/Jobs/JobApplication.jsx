import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applyForJob } from '../../../services/api/jobs';
import { getUserResumes, uploadResume } from '../../../services/api/profile';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const JobApplication = ({ jobId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    resumeId: '',
    coverLetter: ''
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getUserResumes();
      setResumes(data);
      if (data.length > 0) {
        setFormData(prev => ({
          ...prev,
          resumeId: data[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Could not load your resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await uploadResume(formData);
      console.log('Resume upload response in component:', response); // Debug log
      
      // Add the new resume to the list
      const newResume = {
        id: response.resumeId,
        name: file.name,
        originalName: file.name,
        url: response.resumeUrl
      };
      
      console.log('New resume object:', newResume); // Debug log
      
      setResumes(prev => {
        console.log('Previous resumes:', prev); // Debug log
        return [...prev, newResume];
      });
      
      // Set the newly uploaded resume as the selected one
      setFormData(prev => ({
        ...prev,
        resumeId: response.resumeId
      }));
      
      toast.success('Resume uploaded successfully');
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resumeId) {
      toast.error('Please select or upload a resume');
      return;
    }

    try {
      setSubmitting(true);
      
      // Find the selected resume from the resumes array
      const selectedResume = resumes.find(resume => resume.id === formData.resumeId);
      
      if (!selectedResume) {
        toast.error('Selected resume not found. Please try again.');
        return;
      }
      
      const applicationData = {
        resumeId: selectedResume.id,
        resumePath: selectedResume.url,
        coverLetter: formData.coverLetter.trim()
      };

      await applyForJob(jobId, applicationData);
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors && error.response.data.errors[0]) || 
                          'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-effect p-6 rounded-2xl",
      "hover-effect"
    )}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Submit Your Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resume
          </label>
          {resumes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Upload your resume to apply
              </p>
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  or
                </div>
                <Button
                  variant="text"
                  onClick={() => navigate('/jobseeker/profile/resumes?tab=upload')}
                >
                  Manage Resumes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <select
                name="resumeId"
                value={formData.resumeId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {resumes.map(resume => (
                  <option key={resume.id} value={resume.id}>
                    {resume.name || resume.originalName}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Another Resume'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Letter (Optional)
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={6}
            placeholder="Write a brief cover letter explaining why you're a great fit for this position..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || resumes.length === 0}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobApplication; 