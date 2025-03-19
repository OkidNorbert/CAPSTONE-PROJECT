import React, { useState } from 'react';
import { cn } from '../../../utils/styles';

const ActivityReport = () => {
  const [dateRange, setDateRange] = useState('week');
  const [activityData] = useState({
    userActivity: [
      { date: '2024-03-06', newUsers: 25, activeUsers: 150, applications: 85 },
      { date: '2024-03-07', newUsers: 30, activeUsers: 165, applications: 92 },
      { date: '2024-03-08', newUsers: 28, activeUsers: 158, applications: 78 },
      { date: '2024-03-09', newUsers: 35, activeUsers: 172, applications: 95 },
      { date: '2024-03-10', newUsers: 22, activeUsers: 145, applications: 72 },
      { date: '2024-03-11', newUsers: 40, activeUsers: 180, applications: 105 },
      { date: '2024-03-12', newUsers: 32, activeUsers: 168, applications: 88 },
    ],
    jobActivity: [
      { date: '2024-03-06', newJobs: 12, activeJobs: 320, applications: 85 },
      { date: '2024-03-07', newJobs: 15, activeJobs: 328, applications: 92 },
      { date: '2024-03-08', newJobs: 10, activeJobs: 335, applications: 78 },
      { date: '2024-03-09', newJobs: 18, activeJobs: 342, applications: 95 },
      { date: '2024-03-10', newJobs: 8, activeJobs: 338, applications: 72 },
      { date: '2024-03-11', newJobs: 20, activeJobs: 355, applications: 105 },
      { date: '2024-03-12', newJobs: 14, activeJobs: 362, applications: 88 },
    ],
  });

  const calculateTotals = () => {
    return {
      newUsers: activityData.userActivity.reduce((sum, day) => sum + day.newUsers, 0),
      activeUsers: activityData.userActivity[activityData.userActivity.length - 1].activeUsers,
      totalApplications: activityData.userActivity.reduce((sum, day) => sum + day.applications, 0),
      newJobs: activityData.jobActivity.reduce((sum, day) => sum + day.newJobs, 0),
      activeJobs: activityData.jobActivity[activityData.jobActivity.length - 1].activeJobs,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Activity Report
        </h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Activity
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Users</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totals.newUsers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totals.activeUsers}
              </span>
            </div>
          </div>
        </div>

        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Job Activity
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Jobs</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totals.newJobs}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Jobs</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totals.activeJobs}
              </span>
            </div>
          </div>
        </div>

        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Applications
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Applications</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totals.totalApplications}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Avg. per Day</span>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round(totals.totalApplications / 7)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Activity Table */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  New Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Active Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  New Jobs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applications
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {activityData.userActivity.map((day, index) => (
                <tr key={day.date}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {day.newUsers}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {day.activeUsers}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {activityData.jobActivity[index].newJobs}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {day.applications}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityReport;
