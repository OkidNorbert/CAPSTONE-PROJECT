import React, { useState } from 'react';
import { cn } from '../../../utils/styles';

const InterviewScheduler = ({ application, onSchedule }) => {
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: 'video',
    location: '',
    notes: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSchedule = () => {
    onSchedule({
      ...interviewData,
      applicationId: application.id,
      candidateName: application.candidate.name,
      jobTitle: application.jobTitle,
    });
    setShowConfirmation(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Schedule Interview
        </h2>
      </div>

      {/* Candidate Info */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="flex items-center gap-4">
          <div className="text-3xl">👤</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {application.candidate.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {application.jobTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Interview Form */}
      <form onSubmit={handleSubmit} className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={interviewData.date}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={interviewData.time}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={interviewData.duration}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Type
              </label>
              <select
                name="type"
                value={interviewData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>

          {interviewData.type === 'onsite' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={interviewData.location}
                onChange={handleChange}
                placeholder="Enter interview location"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={interviewData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any additional information for the candidate..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => onSchedule(null)}
              className={cn(
                "px-4 py-2 rounded-full",
                "text-sm font-medium",
                "border border-gray-300 dark:border-gray-600",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "hover-effect"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "button-gradient px-6 py-2 rounded-full",
                "text-sm font-medium",
                "hover-effect"
              )}
            >
              Schedule Interview
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={cn(
            "glass-effect p-6 rounded-2xl max-w-md w-full",
            "hover-effect"
          )}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Interview Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to schedule this interview? An invitation will be sent to the candidate.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className={cn(
                  "px-4 py-2 rounded-full",
                  "text-sm font-medium",
                  "border border-gray-300 dark:border-gray-600",
                  "text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  "hover-effect"
                )}
              >
                Cancel
              </button>
              <button
                onClick={confirmSchedule}
                className={cn(
                  "button-gradient px-6 py-2 rounded-full",
                  "text-sm font-medium",
                  "hover-effect"
                )}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
