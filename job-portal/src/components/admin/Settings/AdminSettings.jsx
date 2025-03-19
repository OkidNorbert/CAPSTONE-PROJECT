import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { cn } from '../../../utils/styles';

const AdminSettings = () => {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setMessage({ type: 'success', text: 'Password updated successfully' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <div className={cn(
              "p-4 rounded-lg",
              message.type === 'error' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            )}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border",
                "focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border",
                "focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border",
                "focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full px-4 py-2 rounded-lg",
              "bg-primary-500 text-white",
              "hover:bg-primary-600",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings; 