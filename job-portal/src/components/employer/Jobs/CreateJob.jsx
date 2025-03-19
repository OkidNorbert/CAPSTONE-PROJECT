import React, { useState } from 'react';
import { cn } from '../../../utils/styles';
import { createJob } from '../../../services/api/jobs';
import { toast } from 'react-toastify';

const CreateJob = ({ onSubmit, onCancel }) => {
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experienceMin: '',
    experienceMax: '',
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly'
    },
    skills: [],
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    remote: false,
    urgent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setJobData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !jobData.skills.includes(skillInput.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Validate job description length
      if (jobData.description.length < 50) {
        toast.error('Job description must be at least 50 characters long');
        setIsSubmitting(false);
        return;
      }
      
      // Format the data according to the API requirements
      const formattedData = {
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        type: jobData.type,
        description: jobData.description,
        requirements: jobData.requirements,
        responsibilities: jobData.responsibilities,
        experienceMin: parseInt(jobData.experienceMin) || 0,
        experienceMax: parseInt(jobData.experienceMax) || 0,
        salaryMin: parseInt(jobData.salary.min) || 0,
        salaryMax: parseInt(jobData.salary.max) || 0,
        salaryCurrency: jobData.salary.currency,
        salaryPeriod: jobData.salary.period,
        skills: jobData.skills,
        benefits: jobData.benefits || [],
        remote: jobData.remote,
        status: 'published'
      };

      console.log('Sending job data:', formattedData);
      const response = await createJob(formattedData);
      toast.success('Job posted successfully!');
      onSubmit(response);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Job Posting
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={jobData.department}
                onChange={handleChange}
                placeholder="e.g., Engineering"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                name="experienceMin"
                value={jobData.experienceMin}
                onChange={handleChange}
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Experience (years)
              </label>
              <input
                type="number"
                name="experienceMax"
                value={jobData.experienceMax}
                onChange={handleChange}
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salary Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Salary
              </label>
              <input
                type="number"
                name="salary.min"
                value={jobData.salary.min}
                onChange={handleChange}
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Salary
              </label>
              <input
                type="number"
                name="salary.max"
                value={jobData.salary.max}
                onChange={handleChange}
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                name="salary.currency"
                value={jobData.salary.currency}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Period
              </label>
              <select
                name="salary.period"
                value={jobData.salary.period}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="yearly">Per Year</option>
                <option value="monthly">Per Month</option>
                <option value="hourly">Per Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Required Skills
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleAddSkill}
                type="button"
                className={cn(
                  "button-gradient px-4 py-2 rounded-full",
                  "text-sm font-medium",
                  "hover-effect"
                )}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Details
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the role and responsibilities..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="List the requirements and qualifications..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Responsibilities
              </label>
              <textarea
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleChange}
                rows={4}
                placeholder="List the key responsibilities..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benefits
              </label>
              <textarea
                name="benefits"
                value={jobData.benefits}
                onChange={handleChange}
                rows={4}
                placeholder="List the benefits and perks..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Options
          </h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="remote"
                checked={jobData.remote}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">
                This is a remote position
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="urgent"
                checked={jobData.urgent}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Urgent hiring
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "px-6 py-2 rounded-full",
              "text-sm font-medium",
              "border border-gray-300 dark:border-gray-600",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "hover-effect"
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "button-gradient px-8 py-2 rounded-full",
              "text-sm font-medium",
              "hover-effect",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
