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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
  );
};

export default JobApplication; 