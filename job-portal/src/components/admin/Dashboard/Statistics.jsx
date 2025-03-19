import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../../../utils/styles';

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
        const response = await axios.get('/api/admin/statistics');
        setStats({
          ...response.data,
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
      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{stats.error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      trend: 12,
      icon: '👥',
      color: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs.toLocaleString(),
      trend: 8,
      icon: '💼',
      color: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications.toLocaleString(),
      trend: -5,
      icon: '📝',
      color: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Completed Hires',
      value: stats.completedHires.toLocaleString(),
      trend: 15,
      icon: '🎯',
      color: 'bg-yellow-100 dark:bg-yellow-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default Statistics;
