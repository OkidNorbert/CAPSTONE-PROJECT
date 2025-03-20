import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getJobs } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const JobSearch = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experienceMin: '',
    experienceMax: '',
    salaryMin: '',
    salaryMax: '',
    remote: false,
    skills: [],
    department: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.currentPage]);

  const fetchJobs = async (searchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...searchFilters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };
      
      const response = await getJobs(queryParams);
      
      if (response.jobs) {
        setJobs(response.jobs);
        setPagination(prev => ({
          ...prev,
          totalPages: response.totalPages,
          totalItems: response.totalItems
        }));
      } else {
        setJobs([]);
        toast.info('No jobs found matching your criteria');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchJobs(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: '',
      location: '',
      type: '',
      experienceMin: '',
      experienceMax: '',
      salaryMin: '',
      salaryMax: '',
      remote: false,
      skills: [],
      department: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchJobs(defaultFilters);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="primary" onClick={() => fetchJobs()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Find Your Dream Job</h1>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title, keywords, or company"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, state, or remote"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="customer-service">Customer Service</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="operations">Operations</option>
                <option value="product">Product</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Range (years)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="experienceMin"
                  value={filters.experienceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="number"
                  name="experienceMax"
                  value={filters.experienceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="salaryMin"
                  value={filters.salaryMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="number"
                  name="salaryMax"
                  value={filters.salaryMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remote"
                checked={filters.remote}
                onChange={handleFilterChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Remote Only
              </label>
            </div>

            <div className="flex-grow"></div>

            <div className="flex items-center space-x-2">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="createdAt">Date Posted</option>
                <option value="salary">Salary</option>
                <option value="title">Title</option>
                <option value="company">Company</option>
              </select>

              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={cn(
                    "glass-effect p-6 rounded-2xl cursor-pointer transition-transform hover:scale-[1.02]",
                    "hover-effect"
                  )}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {job.company?.companyName} • {job.company?.companyLocation}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {job.type}
                        </span>
                        {job.remote && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Remote
                          </span>
                        )}
                        {job.department && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            {job.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      {job.salaryMin && job.salaryMax && (
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.description && (
                    <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-2">
                      {job.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobSearch;