import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyApplications } from '../../../services/api/jobs';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const applications = await getMyApplications();
        const foundApplication = applications.find(app => app.id.toString() === id);
        
        if (foundApplication) {
          setApplication(foundApplication);
        } else {
          setError('Application not found');
        }
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError('Failed to load application details. Please try again later.');
        toast.error('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

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
          onClick={() => navigate('/applications')}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Application not found</p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/applications')}
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h1>
        <Button 
          variant="outline"
          onClick={() => navigate('/applications')}
        >
          Back to Applications
        </Button>
      </div>
      
      {/* Job Information */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Information</h2>
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {application.job?.title}
            </h3>
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
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Applied on {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Application Details */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resume</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{application.resumePath}</p>
          </div>
          
          {application.coverLetter && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cover Letter</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-line">{application.coverLetter}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Interview Information */}
      {application.interviews && application.interviews.length > 0 && (
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interview Details</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  {application.interviews[0].type} Interview
                </h3>
                <p className="text-blue-700 dark:text-blue-400 mt-1">
                  Date: {application.interviews[0].date}
                </p>
                <p className="text-blue-700 dark:text-blue-400">
                  Time: {application.interviews[0].time}
                </p>
                {application.interviews[0].location && (
                  <p className="text-blue-700 dark:text-blue-400">
                    Location: {application.interviews[0].location}
                  </p>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  application.interviews[0].status === 'scheduled' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : application.interviews[0].status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {application.interviews[0].status.charAt(0).toUpperCase() + application.interviews[0].status.slice(1)}
                </span>
              </div>
            </div>
            {application.interviews[0].notes && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Notes</h4>
                <p className="mt-1 text-blue-700 dark:text-blue-400">{application.interviews[0].notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline"
          onClick={() => navigate('/applications')}
        >
          Back to Applications
        </Button>
        {(application.status === 'pending' || application.status === 'reviewing') && (
          <Button 
            variant="danger"
            onClick={() => {
              // Implement withdraw functionality
              toast.info('Withdraw functionality will be implemented soon');
            }}
          >
            Withdraw Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;