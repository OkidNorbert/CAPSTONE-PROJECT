import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../../../utils/styles';

const SystemConfig = () => {
  const [settings, setSettings] = useState({
    jobCategories: [],
    emailSettings: {
      notificationsEnabled: true,
      fromEmail: '',
      smtpHost: '',
      smtpPort: '',
      smtpUser: ''
    },
    security: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      requireEmailVerification: true
    },
    general: {
      siteName: 'JobSeek',
      contactEmail: '',
      maxJobPostings: 10,
      maxApplicationsPerJob: 100
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setSettings(response.data);
    } catch (err) {
      setError('Failed to load system settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSubmit = async (category) => {
    try {
      await axios.put(`/api/admin/settings/${category}`, settings[category]);
      setSuccessMessage(`${category} settings updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to update ${category} settings`);
      console.error('Error updating settings:', err);
    }
  };

  const handleAddJobCategory = async (categoryName) => {
    try {
      const response = await axios.post('/api/admin/job-categories', { name: categoryName });
      setSettings(prev => ({
        ...prev,
        jobCategories: [...prev.jobCategories, response.data]
      }));
    } catch (err) {
      setError('Failed to add job category');
      console.error('Error adding job category:', err);
    }
  };

  const handleDeleteJobCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/admin/job-categories/${categoryId}`);
      setSettings(prev => ({
        ...prev,
        jobCategories: prev.jobCategories.filter(cat => cat.id !== categoryId)
      }));
    } catch (err) {
      setError('Failed to delete job category');
      console.error('Error deleting job category:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'email', label: 'Email Configuration', icon: '📧' },
    { id: 'security', label: 'Security Settings', icon: '🔒' },
    { id: 'categories', label: 'Job Categories', icon: '📑' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Configuration</h2>

      {(error || successMessage) && (
        <div className={cn(
          "p-4 rounded-lg mb-6",
          error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        )}>
          {error || successMessage}
        </div>
      )}

      <div className="flex space-x-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg flex items-center space-x-2",
              activeTab === tab.id
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Job Postings per Employer
              </label>
              <input
                type="number"
                value={settings.general.maxJobPostings}
                onChange={(e) => handleSettingChange('general', 'maxJobPostings', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => handleSubmit('general')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Save General Settings
            </button>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Email
              </label>
              <input
                type="email"
                value={settings.emailSettings.fromEmail}
                onChange={(e) => handleSettingChange('emailSettings', 'fromEmail', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.emailSettings.smtpHost}
                onChange={(e) => handleSettingChange('emailSettings', 'smtpHost', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                value={settings.emailSettings.smtpPort}
                onChange={(e) => handleSettingChange('emailSettings', 'smtpPort', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailSettings.notificationsEnabled}
                onChange={(e) => handleSettingChange('emailSettings', 'notificationsEnabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Email Notifications
              </label>
            </div>
            <button
              onClick={() => handleSubmit('emailSettings')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Save Email Settings
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.security.lockoutDuration}
                onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.security.requireEmailVerification}
                onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Require Email Verification
              </label>
            </div>
            <button
              onClick={() => handleSubmit('security')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Save Security Settings
            </button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Categories
              </label>
              <div className="space-y-2">
                {settings.jobCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span>{category.name}</span>
                    <button
                      onClick={() => handleDeleteJobCategory(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="New category name"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      handleAddJobCategory(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfig;
