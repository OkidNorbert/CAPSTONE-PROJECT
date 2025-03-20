import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import Button from '../../shared/UI/Button';

const SavedJobs = () => {
  const [savedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'Remote',
      salary: '$120k - $150k',
      savedDate: '2024-03-15',
      deadline: '2024-04-15'
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York',
      salary: '$90k - $110k',
      savedDate: '2024-03-14',
      deadline: '2024-04-01'
    }
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>
      {savedJobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">📍 {job.location}</p>
                <p className="text-sm text-gray-500">💰 {job.salary}</p>
                <p className="text-sm text-gray-500">
                  ⏰ Application Deadline: {job.deadline}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="primary" size="sm">Apply Now</Button>
              <Button variant="outline" size="sm">Remove</Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Saved on {job.savedDate}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedJobs;