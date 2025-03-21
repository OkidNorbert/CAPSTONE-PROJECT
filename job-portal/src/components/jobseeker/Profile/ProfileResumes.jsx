import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResumeList from './ResumeList';
import ResumeBuilder from './ResumeBuilder';
import ResumeUpload from './ResumeUpload';
import { cn } from '../../../utils/styles';

const ProfileResumes = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'list'); // 'list', 'upload', or 'builder'

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['list', 'upload', 'builder'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Management</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('list')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'list'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  My Resumes
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'upload'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  Upload Resume
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'builder'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  Resume Builder
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
              {activeTab === 'list' && (
                <ResumeList onResumeDeleted={() => {}} />
              )}
              {activeTab === 'upload' && (
                <ResumeUpload onUploadSuccess={() => setActiveTab('list')} />
              )}
              {activeTab === 'builder' && (
                <ResumeBuilder />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileResumes; 