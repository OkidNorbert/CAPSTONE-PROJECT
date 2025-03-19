import React, { useState } from 'react';
import { cn } from '../../../utils/styles';
import ApplicationStatus from './ApplicationStatus';

const MyApplications = () => {
  const [applications] = useState([
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      company: 'Tech Corp',
      companyLogo: '🏢',
      appliedDate: '2024-03-01',
      status: 'interview',
      lastUpdated: '2024-03-10',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
    },
    {
      id: 2,
      jobTitle: 'UX Designer',
      company: 'Design Studio',
      companyLogo: '🎨',
      appliedDate: '2024-03-05',
      status: 'reviewing',
      lastUpdated: '2024-03-08',
      location: 'Remote',
      type: 'Contract',
      salary: '$80,000 - $100,000',
    },
    {
      id: 3,
      jobTitle: 'Product Manager',
      company: 'Startup Inc',
      companyLogo: '🚀',
      appliedDate: '2024-03-08',
      status: 'pending',
      lastUpdated: '2024-03-08',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130,000 - $160,000',
    },
  ]);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Applications
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              onClick={() => setSelectedApplication(application)}
              className={cn(
                "glass-effect p-4 rounded-2xl cursor-pointer",
                "hover-effect",
                selectedApplication?.id === application.id && "ring-2 ring-primary-500"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{application.companyLogo}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.jobTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {application.company}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      📍 {application.location}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      💼 {application.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      💰 {application.salary}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    application.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                    application.status === 'reviewing' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                    application.status === 'shortlisted' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                    application.status === 'interview' && "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
                    application.status === 'accepted' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                    application.status === 'rejected' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {application.status}
                  </span>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Applied {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No applications found matching the selected filter.
              </p>
            </div>
          )}
        </div>

        {/* Application Details */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <ApplicationStatus
              status={selectedApplication.status}
              lastUpdated={selectedApplication.lastUpdated}
            />
          ) : (
            <div className={cn(
              "glass-effect p-6 rounded-2xl text-center",
              "hover-effect"
            )}>
              <p className="text-gray-500 dark:text-gray-400">
                Select an application to view its status
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
