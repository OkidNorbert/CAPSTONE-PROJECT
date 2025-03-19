import React from 'react';
import Statistics from './Statistics';

const Overview = ({ onTabChange }) => {
  return (
    <div className="p-6 space-y-8">
      {/* Quick Stats */}
      <Statistics />

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">●</span>
              <div>
                <p className="text-sm font-medium">New User Registration</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">John Doe registered as an employer</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-blue-500">●</span>
              <div>
                <p className="text-sm font-medium">New Job Posted</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Senior Developer at Tech Corp</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => onTabChange('users')}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">👥</span>
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View and manage user accounts</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => onTabChange('jobs')}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">💼</span>
                <div>
                  <p className="font-medium">Manage Jobs</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Review and moderate job postings</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => onTabChange('settings')}
              className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">⚙️</span>
                <div>
                  <p className="font-medium">System Settings</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure platform settings</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database Health</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Good
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage Usage</span>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 