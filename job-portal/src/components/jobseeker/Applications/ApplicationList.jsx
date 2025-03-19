import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyApplications } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const ApplicationList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyApplications();
        console.log('Fetched applications:', data);
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch your applications. Please try again later.');
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className={cn(
        "glass-effect p-8 rounded-2xl text-center",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">No Applications Yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't applied to any jobs yet. Start exploring opportunities!
        </p>
        <Button 
          variant="primary"
          onClick={() => navigate('/jobseeker/jobs/search')}
        >
          Find Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <div 
            key={application.id}
            className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {application.job?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {application.job?.company?.companyName} • {application.job?.location}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {application.job?.type}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                </p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-2 md:mt-auto"
                  onClick={() => navigate(`/jobseeker/applications/${application.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
            
            {application.interviews && application.interviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                  Interview Scheduled
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-300">
                    <span className="font-medium">{application.interviews[0].type} Interview:</span> {application.interviews[0].date} at {application.interviews[0].time}
                  </p>
                  {application.interviews[0].location && (
                    <p className="text-blue-700 dark:text-blue-400 mt-1 text-sm">
                      Location: {application.interviews[0].location}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList; 