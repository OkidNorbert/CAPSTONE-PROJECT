import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';
import CreateJob from './CreateJob';
import { getEmployerJobs, createJob } from '../../../services/api/jobs';

const JobList = () => {
  const navigate = useNavigate();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployerJobs();
      console.log('Fetched jobs:', data);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData) => {
    try {
      const newJob = await createJob(jobData);
      toast.success('Job posted successfully!');
      setShowCreateJob(false);
      fetchJobs(); // Refresh job list after creation
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchJobs}>
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {showCreateJob ? (
        <CreateJob 
          onSubmit={handleCreateJob}
          onCancel={() => setShowCreateJob(false)}
        />
      ) : (
        <Card 
          title="Posted Jobs" 
          headerAction={
            <Button 
              variant="primary"
              onClick={() => setShowCreateJob(true)}
            >
              Post New Job
            </Button>
          }
        >
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No jobs posted yet</p>
              <Button 
                variant="primary"
                onClick={() => setShowCreateJob(true)}
              >
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{job.applications?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/employer/jobs/${job.id}`)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default JobList;