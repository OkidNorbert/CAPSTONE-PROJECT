import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/styles';
import { getDashboardStats } from '../../../services/api/admin';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, trend, icon, color, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    completedHires: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        
        setStats({
          totalUsers: data.users?.total || 0,
          activeJobs: data.jobs?.active || 0,
          totalApplications: data.applications?.total || 0,
          completedHires: data.applications?.accepted || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <p className="text-sm font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon="👥"
        color="bg-blue-100 dark:bg-blue-900/20"
        isLoading={loading}
      />
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon="💼"
        color="bg-green-100 dark:bg-green-900/20"
        isLoading={loading}
      />
      <StatCard
        title="Total Applications"
        value={stats.totalApplications}
        icon="📝"
        color="bg-yellow-100 dark:bg-yellow-900/20"
        isLoading={loading}
      />
      <StatCard
        title="Completed Hires"
        value={stats.completedHires}
        icon="✅"
        color="bg-purple-100 dark:bg-purple-900/20"
        isLoading={loading}
      />
    </div>
  );
};

export default Statistics;
