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
<<<<<<< HEAD
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
=======
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experienceMin: '',
<<<<<<< HEAD
    experienceMax: '',
    salaryMin: '',
    salaryMax: '',
    remote: false,
    skills: [],
    department: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
=======
    salaryMin: '',
    remote: false
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
  });

  useEffect(() => {
    fetchJobs();
<<<<<<< HEAD
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
=======
  }, []);

  const fetchJobs = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs(searchFilters);
      console.log('Fetched jobs:', data);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again later.');
      toast.error('Failed to fetch jobs');
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
<<<<<<< HEAD
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
=======
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setPagination(prev => ({ ...prev, currentPage: 1 }));
=======
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
    fetchJobs(filters);
  };

  const handleClearFilters = () => {
<<<<<<< HEAD
    const defaultFilters = {
=======
    setFilters({
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
      search: '',
      location: '',
      type: '',
      experienceMin: '',
<<<<<<< HEAD
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

=======
      salaryMin: '',
      remote: false
    });
    fetchJobs({});
  };

>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
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
<<<<<<< HEAD
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
=======
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
<<<<<<< HEAD
              <input
                type="text"
=======
        <input
          type="text"
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, state, or remote"
<<<<<<< HEAD
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            
=======
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
<<<<<<< HEAD
                className="w-full rounded-md border border-gray-300 px-3 py-2"
=======
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
<<<<<<< HEAD

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="customer-service">Customer Service</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience (Years)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="experienceMin"
                  value={filters.experienceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <input
                  type="number"
                  name="experienceMax"
                  value={filters.experienceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
                <input
                  type="number"
                  name="salaryMax"
                  value={filters.salaryMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="createdAt">Date Posted</option>
                <option value="salaryMin">Salary</option>
                <option value="title">Title</option>
                <option value="company">Company</option>
              </select>

              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

=======
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Experience (years)
              </label>
              <input
                type="number"
                name="experienceMin"
                value={filters.experienceMin}
                onChange={handleFilterChange}
                min="0"
                placeholder="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Salary
              </label>
              <input
                type="number"
                name="salaryMin"
                value={filters.salaryMin}
                onChange={handleFilterChange}
                min="0"
                placeholder="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="remote"
                  checked={filters.remote}
                  onChange={handleFilterChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
                <span className="text-gray-700 dark:text-gray-300">
                  Remote Only
                </span>
              </label>
            </div>
          </div>
          
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
          <div className="flex justify-end space-x-4">
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
<<<<<<< HEAD
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Jobs'}
=======
            >
              Search Jobs
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
<<<<<<< HEAD
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className={cn(
                "glass-effect p-6 rounded-2xl cursor-pointer",
                "hover-effect transition-all duration-300"
              )}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {job.company.name} • {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary-600 font-semibold">
                    {job.salaryMin && job.salaryMax ? 
                      `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 
                      'Salary not specified'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {job.type}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                  {job.description}
                </p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                {job.remote && (
                  <span className="text-green-600">Remote</span>
                )}
              </div>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria</p>
        </div>
=======
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="primary" 
            onClick={() => fetchJobs(filters)}
          >
            Try Again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className={cn(
          "glass-effect p-8 rounded-2xl text-center",
          "hover-effect"
        )}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">No Jobs Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any jobs matching your criteria. Try adjusting your filters.
          </p>
          <Button 
            variant="primary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
            <div 
              key={job.id}
              className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect",
                "cursor-pointer"
              )}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex flex-col md:flex-row justify-between">
              <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {job.company?.companyName} • {job.location}
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
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {job.salaryCurrency} {job.salaryMin} - {job.salaryMax}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.experienceMin} - {job.experienceMax} years
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
              </div>
              )}
            </div>
        ))}
      </div>
>>>>>>> 4ece3fb8753913be06bb5a99ea88780892ad2f4c
      )}
    </div>
  );
};

export default JobSearch;