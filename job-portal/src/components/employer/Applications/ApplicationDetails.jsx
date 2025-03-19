import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '../../../utils/styles';
import ApplicationStatus from '../../jobseeker/Applications/ApplicationStatus';
import InterviewScheduler from './InterviewScheduler';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch application data from API
    // For now, using mock data
    setApplication({
      id,
      status: 'reviewing',
      lastUpdated: new Date().toISOString(),
      candidate: {
        name: 'John Doe',
        email: 'john@example.com',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
      },
      documents: [
        { name: 'Resume.pdf', type: 'PDF', size: '2.1 MB', url: '#' },
        { name: 'Cover Letter.pdf', type: 'PDF', size: '1.5 MB', url: '#' },
      ],
      notes: ''
    });
    setLoading(false);
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      // TODO: Update status via API
      setApplication(prev => ({
        ...prev,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleScheduleInterview = async (interviewData) => {
    try {
      // TODO: Schedule interview via API
      setApplication(prev => ({
        ...prev,
        status: 'interview',
        lastUpdated: new Date().toISOString()
      }));
      setShowInterviewScheduler(false);
    } catch (error) {
      console.error('Failed to schedule interview:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className={cn(
          "glass-effect p-6 rounded-2xl text-center max-w-md w-full",
          "hover-effect"
        )}>
          <p className="text-gray-500 dark:text-gray-400">
            Application not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Candidate Information */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {application.candidate.profilePicture ? (
            <img
              src={application.candidate.profilePicture}
              alt={application.candidate.name}
              className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-3xl sm:text-2xl flex-shrink-0">
              {application.candidate.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {application.candidate.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {application.candidate.email}
            </p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              {application.candidate.location && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  📍 {application.candidate.location}
                </span>
              )}
              {application.candidate.phone && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  📞 {application.candidate.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Status */}
      <ApplicationStatus
        status={application.status}
        lastUpdated={application.lastUpdated}
      />

      {/* Actions */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
          Actions
        </h3>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          <button
            onClick={() => handleStatusChange('reviewing')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto text-center",
              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
              "hover:bg-blue-200 dark:hover:bg-blue-900/50"
            )}
          >
            Mark as Reviewing
          </button>
          <button
            onClick={() => handleStatusChange('shortlisted')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto text-center",
              "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
              "hover:bg-purple-200 dark:hover:bg-purple-900/50"
            )}
          >
            Shortlist
          </button>
          <button
            onClick={() => setShowInterviewScheduler(true)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto text-center",
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              "hover:bg-green-200 dark:hover:bg-green-900/50"
            )}
          >
            Schedule Interview
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium w-full sm:w-auto text-center",
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
              "hover:bg-red-200 dark:hover:bg-red-900/50"
            )}
          >
            Reject
          </button>
        </div>
      </div>

      {/* Resume and Documents */}
      {application.documents && (
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
            Documents
          </h3>
          <div className="space-y-3">
            {application.documents.map((doc, index) => (
              <a
                key={index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg",
                  "bg-white dark:bg-gray-800",
                  "hover:bg-gray-50 dark:hover:bg-gray-700",
                  "border border-gray-200 dark:border-gray-700"
                )}
              >
                <span className="text-xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center sm:text-left">
          Notes
        </h3>
        <textarea
          className="w-full h-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-y"
          placeholder="Add notes about this candidate..."
          value={application.notes || ''}
          onChange={(e) => {
            setApplication(prev => ({
              ...prev,
              notes: e.target.value
            }));
          }}
        />
      </div>

      {/* Interview Scheduler Modal */}
      {showInterviewScheduler && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full mx-auto max-h-[90vh] overflow-y-auto">
            <InterviewScheduler
              application={application}
              onSchedule={handleScheduleInterview}
              onCancel={() => setShowInterviewScheduler(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
