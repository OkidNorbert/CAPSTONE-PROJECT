import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobById } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import JobApplication from './JobApplication';
import { cn } from '../../../utils/styles';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJobById(id);
        // Ensure skills are properly formatted
        const formattedJob = {
          ...data,
          skills: Array.isArray(data.skills) ? data.skills :
                  typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()) :
                  data.skills ? JSON.parse(data.skills) :
                  []
        };
        setJob(formattedJob);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details. Please try again later.');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApplySuccess = () => {
    setShowApplication(false);
    toast.success('Your application has been submitted successfully!');
    navigate('/jobseeker/applications');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Job not found</p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Header */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {job.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                {job.location}
              </span>
              {job.remote && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Remote
                </span>
              )}
            </div>
          </div>
          <div>
            {!showApplication && (
              <Button 
                variant="primary"
                onClick={() => setShowApplication(true)}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Application Form */}
      {showApplication && (
        <JobApplication 
          jobId={id} 
          onSuccess={handleApplySuccess}
          onCancel={() => setShowApplication(false)}
        />
      )}

      {/* Company Info */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Company Information</h2>
        <div className="flex items-center gap-4">
          {job.company?.companyLogo && (
            <img 
              src={job.company.companyLogo} 
              alt={job.company.companyName} 
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.company?.companyName}</h3>
            <p className="text-gray-600 dark:text-gray-400">{job.company?.location}</p>
          </div>
        </div>
        {job.company?.companyDescription && (
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">{job.company.companyDescription}</p>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{job.department || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {job.experienceMin} - {job.experienceMax} years
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {job.salaryCurrency} {job.salaryMin} - {job.salaryMax} ({job.salaryPeriod})
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.requirements}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Responsibilities</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.responsibilities}</p>
          </div>
          
          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Benefits</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
          
          {/* Skills section */}
          {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Apply Button (Bottom) */}
      {!showApplication && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="primary"
            size="lg"
            onClick={() => setShowApplication(true)}
          >
            Apply for this Position
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetail; 