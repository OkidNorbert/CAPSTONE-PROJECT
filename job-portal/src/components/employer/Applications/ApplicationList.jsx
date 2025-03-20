import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';

const ApplicationList = () => {
  const [applications] = useState([
    {
      id: 1,
      applicant: 'John Doe',
      position: 'Senior React Developer',
      appliedDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: 2,
      applicant: 'Jane Smith',
      position: 'UX Designer',
      appliedDate: '2024-03-14',
      status: 'interviewed'
    }
  ]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    interviewed: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <Card title="Applications">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">{application.applicant}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{application.appliedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[application.status]}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="primary" size="sm" className="mr-2">Review</Button>
                  <Button variant="outline" size="sm">Schedule</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ApplicationList;