import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployerJobs } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';
import CreateJob from './CreateJob';

const JobList = () => {
  const navigate = useNavigate();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployerJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      toast.success('Job posted successfully!');
      setShowCreateJob(false);
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
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
        <Button variant="primary" onClick={fetchJobs}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posted Jobs</h1>
        <Button 
          variant="primary"
          onClick={() => setShowCreateJob(true)}
        >
          Post New Job
        </Button>
      </div>

      {showCreateJob ? (
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <CreateJob 
            onSubmit={handleCreateJob}
            onCancel={() => setShowCreateJob(false)}
          />
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <div className={cn(
              "glass-effect p-8 rounded-2xl text-center",
              "hover-effect"
            )}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                No Jobs Posted Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start posting jobs to find the perfect candidates for your company.
              </p>
              <Button 
                variant="primary"
                onClick={() => setShowCreateJob(true)}
              >
                Post Your First Job
              </Button>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className={cn(
                  "glass-effect p-6 rounded-2xl",
                  "hover-effect"
                )}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">
                        📍 {job.location}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        💼 {job.type}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        👥 {job.applications?.length || 0} Applications
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        job.status === 'published' 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      {job.remote && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
                      >
                        View Applications
                      </Button>
                      <Button 
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                      >
                        Edit Job
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
