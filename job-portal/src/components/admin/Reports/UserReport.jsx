import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';

const UserReport = () => {
  const [dateRange, setDateRange] = useState('week');
  const [reports] = useState({
    totalUsers: 1234,
    newUsers: 56,
    activeUsers: 789,
    employerUsers: 234,
    jobSeekerUsers: 1000,
    userGrowth: [
      { date: '2024-03-01', count: 1200 },
      { date: '2024-03-07', count: 1234 },
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics</h2>
        <div className="space-x-2">
          <Button 
            variant={dateRange === 'week' ? 'primary' : 'outline'}
            onClick={() => setDateRange('week')}
          >
            Week
          </Button>
          <Button 
            variant={dateRange === 'month' ? 'primary' : 'outline'}
            onClick={() => setDateRange('month')}
          >
            Month
          </Button>
          <Button 
            variant={dateRange === 'year' ? 'primary' : 'outline'}
            onClick={() => setDateRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {reports.totalUsers}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">New Users</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {'+' + reports.newUsers}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {reports.activeUsers}
            </p>
          </div>
        </Card>
      </div>

      <Card title="User Distribution">
        <div className="flex justify-around py-4">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-500">Employers</h4>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {reports.employerUsers}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-500">Job Seekers</h4>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {reports.jobSeekerUsers}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserReport;