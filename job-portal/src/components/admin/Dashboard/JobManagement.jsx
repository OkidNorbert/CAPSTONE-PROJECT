import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/styles';
import { getAdminJobs, updateJobStatus, toggleJobFeatured, deleteJob } from '../../../services/api/admin';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showJobModal, setShowJobModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, statusFilter]);

  const fetchJobs = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined
      };
      
      const response = await getAdminJobs(params);
      setJobs(response.jobs);
      setPagination({
        page: response.page,
        total: response.total,
        pages: response.pages
      });
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      fetchJobs(); // Refresh the list
    } catch (err) {
      setError('Failed to update job status');
    }
  };

  const handleFeaturedToggle = async (jobId, featured) => {
    try {
      await toggleJobFeatured(jobId, featured);
      fetchJobs(); // Refresh the list
    } catch (err) {
      setError('Failed to update job featured status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        fetchJobs(); // Refresh jobs list
      } catch (err) {
        setError('Failed to delete job');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Management</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Posted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {job.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {job.companyName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className="text-sm rounded border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleFeaturedToggle(job.id, !job.featured)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      job.featured
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {job.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowJobModal(true);
                    }}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {jobs.length} of {pagination.total} jobs
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Job Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{selectedJob.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{selectedJob.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{selectedJob.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Posted Date</p>
                <p className="font-medium">
                  {new Date(selectedJob.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium whitespace-pre-wrap">{selectedJob.description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowJobModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement; 