import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/styles';

const JobCard = ({ job, onUpdate }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={cn(
      "glass-effect p-6 rounded-2xl",
      "hover-effect transition-all duration-300",
      "hover:shadow-lg dark:hover:shadow-primary-900/20"
    )}>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on {formatDate(job.createdAt)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{job.type}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{job.applications?.length || 0} Applications</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              job.status === 'published' 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            )}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
            {job.remote && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Remote
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-end gap-4 md:items-end">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/employer/jobs/${job.id}/applications`)}
              className={cn(
                "px-4 py-2 rounded-full",
                "text-sm font-medium",
                "border border-gray-300 dark:border-gray-600",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              View Applications
            </button>
            <button
              onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
              className={cn(
                "button-gradient px-4 py-2 rounded-full",
                "text-sm font-medium",
                "hover-effect"
              )}
            >
              Edit Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 