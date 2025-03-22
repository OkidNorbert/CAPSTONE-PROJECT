import React, { useState } from 'react';
import Statistics from './Statistics';
import UserManagement from './UserManagement';
import JobManagement from './JobManagement';
import SystemConfig from './SystemConfig';
import { cn } from '../../../utils/styles';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Statistics />;
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'settings':
        return <SystemConfig />;
      default:
        return <Statistics />;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    activeTab === 'overview'
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  )}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    activeTab === 'users'
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  )}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    activeTab === 'jobs'
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  )}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    activeTab === 'settings'
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  )}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 