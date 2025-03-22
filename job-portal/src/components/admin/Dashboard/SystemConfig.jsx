import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/styles';
import { getSystemConfig, updateSystemConfig, getJobCategories, addJobCategory, updateJobCategory, deleteJobCategory } from '../../../services/api/admin';

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
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSystemConfig();
      setSettings(prev => ({
        ...prev,
        ...data
      }));
    } catch (err) {
      setError('Failed to load system settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await getJobCategories();
      setSettings(prev => ({
        ...prev,
        jobCategories: categories
      }));
    } catch (err) {
      setError('Failed to load job categories');
      console.error('Error fetching categories:', err);
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
      await updateSystemConfig(category, settings[category]);
      setSuccessMessage(`${category} settings updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to update ${category} settings`);
      console.error('Error updating settings:', err);
    }
  };

  const handleAddJobCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const category = await addJobCategory({ name: newCategory.trim() });
      setSettings(prev => ({
        ...prev,
        jobCategories: [...prev.jobCategories, category]
      }));
      setNewCategory('');
    } catch (err) {
      setError('Failed to add job category');
      console.error('Error adding job category:', err);
    }
  };

  const handleDeleteJobCategory = async (categoryId) => {
    try {
      await deleteJobCategory(categoryId);
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Applications per Job
              </label>
              <input
                type="number"
                value={settings.general.maxApplicationsPerJob}
                onChange={(e) => handleSettingChange('general', 'maxApplicationsPerJob', parseInt(e.target.value))}
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
                type="number"
                value={settings.emailSettings.smtpPort}
                onChange={(e) => handleSettingChange('emailSettings', 'smtpPort', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                value={settings.emailSettings.smtpUser}
                onChange={(e) => handleSettingChange('emailSettings', 'smtpUser', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
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
            <form onSubmit={handleAddJobCategory} className="flex gap-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Add Category
              </button>
            </form>

            <div className="space-y-4">
              {settings.jobCategories.map(category => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-gray-900 dark:text-white">{category.name}</span>
                  <button
                    onClick={() => handleDeleteJobCategory(category.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfig;
