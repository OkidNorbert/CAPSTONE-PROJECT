import React from 'react';
import { cn } from '../../../utils/styles';

const ApplicationStatus = ({ status, lastUpdated, timeline }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'reviewing':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'shortlisted':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'interview':
        return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30';
      case 'accepted':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const defaultTimeline = [
    {
      status: 'Applied',
      date: lastUpdated,
      description: 'Application submitted successfully',
      completed: true,
    },
    {
      status: 'Under Review',
      date: null,
      description: 'Application is being reviewed by the hiring team',
      completed: status === 'reviewing' || status === 'shortlisted' || status === 'interview' || status === 'accepted',
    },
    {
      status: 'Shortlisted',
      date: null,
      description: 'Selected for further evaluation',
      completed: status === 'shortlisted' || status === 'interview' || status === 'accepted',
    },
    {
      status: 'Interview',
      date: null,
      description: 'Interview scheduled',
      completed: status === 'interview' || status === 'accepted',
    },
    {
      status: 'Decision',
      date: null,
      description: 'Final decision made',
      completed: status === 'accepted' || status === 'rejected',
    },
  ];

  const currentTimeline = timeline || defaultTimeline;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor(status)
          )}>
            {status}
          </span>
        </div>
      </div>

      {/* Application Timeline */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Application Timeline
        </h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {currentTimeline.map((item, index) => (
              <div key={index} className="relative flex items-start">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-4 w-3 h-3 rounded-full mt-1.5 -translate-x-1.5",
                  item.completed
                    ? "bg-primary-600 ring-2 ring-primary-600/30"
                    : "bg-gray-300 dark:bg-gray-600"
                )} />

                {/* Timeline Content */}
                <div className="ml-10">
                  <div className="flex items-center">
                    <h4 className={cn(
                      "text-sm font-medium",
                      item.completed
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.status}
                    </h4>
                    {item.date && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
