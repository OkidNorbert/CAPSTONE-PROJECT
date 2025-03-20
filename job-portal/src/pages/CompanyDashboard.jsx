import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '../utils/styles';
import CreateJob from '../components/employer/Jobs/CreateJob';
import { getDashboardStats, getRecentApplications } from '../services/api/employer';
import { createJob } from '../services/api/jobs';
import Button from '../components/shared/UI/Button';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    viewsToday: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, applicationsData] = await Promise.all([
        getDashboardStats(),
        getRecentApplications()
      ]);
      setStats(statsData);
      setRecentApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      toast.success('Job posted successfully!');
      setShowCreateJob(false);
      fetchDashboardData(); // Refresh dashboard data
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showCreateJob ? (
          <CreateJob
            onSubmit={handleCreateJob}
            onCancel={() => setShowCreateJob(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
              <Button 
                variant="primary"
                onClick={() => setShowCreateJob(true)}
              >
                Post New Job
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Jobs</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.activeJobs}</p>
              </div>
              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Applications</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.totalApplications}</p>
              </div>
              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Applications</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.newApplications}</p>
              </div>
              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Views Today</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.viewsToday}</p>
              </div>
            </div>

            {/* Recent Applications */}
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/company/applications')}
                >
                  View All
                </Button>
              </div>
              {recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No recent applications</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentApplications.map((application) => (
                        <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{application.job.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {application.applicant.firstName} {application.applicant.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              application.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                              application.status === 'reviewing' ? "bg-blue-100 text-blue-800" :
                              application.status === 'shortlisted' ? "bg-purple-100 text-purple-800" :
                              application.status === 'hired' ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                            )}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/employer/applications/${application.id}`)}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard; 