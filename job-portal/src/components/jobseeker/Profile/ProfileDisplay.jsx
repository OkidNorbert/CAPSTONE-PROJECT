import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile } from '../../../services/api/profile';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';
import PersonalProfile from './PersonalProfile';
import ResumeUpload from './ResumeUpload';

const ProfileDisplay = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchProfile();
    setShowResumeUpload(false);
    toast.success('Resume uploaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load profile. Please try again.</p>
        <Button variant="primary" onClick={fetchProfile}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isEditing ? (
        <PersonalProfile
          initialData={profile}
          onSaveSuccess={() => {
            setIsEditing(false);
            fetchProfile();
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Profile Header */}
          <div className={cn(
            "glass-effect p-6 rounded-2xl",
            "hover-effect"
          )}>
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      👤
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.headline}</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    📧 {profile.email}
                  </p>
                  {profile.phoneNumber && (
                    <p className="text-gray-600 dark:text-gray-400">
                      📱 {profile.phoneNumber}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-gray-600 dark:text-gray-400">
                      📍 {profile.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resume</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowResumeUpload(true)}
                >
                  Upload Resume
                </Button>
              </div>
              {profile.resume ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-400">Current Resume:</span>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    View Resume
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No resume uploaded yet</p>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div className={cn(
            "glass-effect p-6 rounded-2xl",
            "hover-effect"
          )}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {profile.summary || 'No professional summary added yet.'}
            </p>
          </div>

          {/* Skills */}
          <div className={cn(
            "glass-effect p-6 rounded-2xl",
            "hover-effect"
          )}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Job Preferences */}
          <div className={cn(
            "glass-effect p-6 rounded-2xl",
            "hover-effect"
          )}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Preferences</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Preferred Job Types</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.preferences?.jobTypes?.length > 0 ? (
                    profile.preferences.jobTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No preferred job types specified.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Preferred Industries</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.preferences?.industries?.length > 0 ? (
                    profile.preferences.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm"
                      >
                        {industry}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No preferred industries specified.</p>
                  )}
                </div>
              </div>
              {profile.preferences?.salaryExpectation && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Salary Expectation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profile.preferences.salaryExpectation}
                  </p>
                </div>
              )}
              <div className="flex items-center mt-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  profile.preferences?.isOpenToRemote
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {profile.preferences?.isOpenToRemote ? '✓ Open to Remote Work' : '✗ Not Open to Remote Work'}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className={cn(
            "glass-effect p-6 rounded-2xl",
            "hover-effect"
          )}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              )}
              {profile.socialLinks?.portfolio && (
                <a
                  href={profile.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  <span>Portfolio</span>
                  <span>↗</span>
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400"
                >
                  <span>Twitter</span>
                  <span>↗</span>
                </a>
              )}
              {!profile.socialLinks?.linkedin && 
               !profile.socialLinks?.github && 
               !profile.socialLinks?.portfolio && 
               !profile.socialLinks?.twitter && (
                <p className="text-gray-600 dark:text-gray-400 col-span-2">No social links added yet.</p>
              )}
            </div>
          </div>

          {/* Resume Upload Modal */}
          {showResumeUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Upload Resume
                </h2>
                <ResumeUpload
                  onUploadSuccess={handleUploadSuccess}
                  onCancel={() => setShowResumeUpload(false)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileDisplay;