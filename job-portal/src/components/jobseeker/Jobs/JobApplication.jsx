import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { applyForJob } from '../../../services/api/jobs';
import { getUserResumes } from '../../../services/api/profile';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const JobApplication = ({ jobId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.resumeId) {
      toast.error('Please select a resume');
      return;
    }

    try {
      setSubmitting(true);
      await applyForJob(jobId, formData);
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
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
            Select Resume
          </label>
          {resumes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't uploaded any resumes yet
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/profile/resumes')}
              >
                Upload Resume
              </Button>
            </div>
          ) : (
            <select
              name="resumeId"
              value={formData.resumeId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {resumes.map(resume => (
                <option key={resume.id} value={resume.id}>
                  {resume.title || resume.originalName}
                </option>
              ))}
            </select>
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