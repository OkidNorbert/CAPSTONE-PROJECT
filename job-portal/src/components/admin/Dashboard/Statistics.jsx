import React, { useState, useEffect } from 'react';
import { cn } from '../../../utils/styles';
import { getDashboardStats } from '../../../services/api/admin';

const StatCard = ({ title, value, trend, icon, color }) => (
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

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    completedHires: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          totalUsers: data.users.total,
          activeJobs: data.jobs.active,
          totalApplications: data.applications.total,
          completedHires: data.applications.accepted,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        {stats.error}
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
      />
      <StatCard
        title="Active Jobs"
        value={stats.activeJobs}
        icon="💼"
        color="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Total Applications"
        value={stats.totalApplications}
        icon="📝"
        color="bg-yellow-100 dark:bg-yellow-900/20"
      />
      <StatCard
        title="Completed Hires"
        value={stats.completedHires}
        icon="✅"
        color="bg-purple-100 dark:bg-purple-900/20"
      />
    </div>
  );
};

export default Statistics;
