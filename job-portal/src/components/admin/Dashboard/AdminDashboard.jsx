import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/styles';
import Statistics from './Statistics';
import UserManagement from './UserManagement';
import SystemConfig from './SystemConfig';
import JobManagement from './JobManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'jobs', label: 'Job Management', icon: '💼' },
    { id: 'reports', label: 'Analytics & Reports', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Statistics />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-500">●</span>
                      <div>
                        <p className="text-sm font-medium">New User Registration</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">●</span>
                      <div>
                        <p className="text-sm font-medium">New Job Posted</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Server Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Operational</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Health</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'settings':
        return <SystemConfig />;
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                {/* Add chart component here */}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Job Postings</h3>
                {/* Add chart component here */}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Control Panel
            </h1>
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500"
                onClick={() => navigate('/admin/notifications')}
              >
                🔔 Notifications
              </button>
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500"
                onClick={() => navigate('/admin/settings')}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <nav className="space-y-2 sticky top-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 rounded-lg text-left",
                    "transition-colors duration-200",
                    activeTab === tab.id
                      ? "bg-primary-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  )}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 