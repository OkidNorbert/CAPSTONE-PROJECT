import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployerJobs, createJob } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';
import CreateJob from './CreateJob';
import JobCard from './JobCard';

const JobList = () => {
  const navigate = useNavigate();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getEmployerJobs();
      if (!Array.isArray(response.data)) {
        console.error('Invalid response format: expected an array');
        setJobs([]);
        setError('Invalid data format received from server');
        toast.error('Failed to load jobs properly');
        return;
      }
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
      toast.error(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData) => {
    try {
      const response = await createJob(jobData);
      toast.success('Job posted successfully!');
      setShowCreateJob(false);
      fetchJobs(); // Refresh the job list
      return response;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Postings
        </h2>
        <button
          onClick={() => setShowCreateJob(true)}
          className={cn(
            "button-gradient px-6 py-2 rounded-full",
            "text-sm font-medium",
            "hover-effect"
          )}
        >
          Create New Job
        </button>
      </div>

      {showCreateJob ? (
        <CreateJob
          onSubmit={handleCreateJob}
          onCancel={() => setShowCreateJob(false)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {error && (
            <div className="text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {jobs.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No jobs posted yet
            </div>
          ) : (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onUpdate={fetchJobs}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
