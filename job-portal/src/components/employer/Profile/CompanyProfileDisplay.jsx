import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCompanyProfile } from '../../../services/api/employer';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';
import CompanyProfile from './CompanyProfile';

const CompanyProfileDisplay = () => {
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const data = await getCompanyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (showEdit) {
    return <CompanyProfile initialData={profile} onSaveSuccess={() => {
      setShowEdit(false);
      fetchCompanyProfile();
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
        <Button
          variant="primary"
          onClick={() => setShowEdit(true)}
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Logo and Quick Info */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl lg:col-span-1",
          "hover-effect"
        )}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              {profile?.companyLogo ? (
                <img
                  src={profile.companyLogo}
                  alt={profile.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
              {profile?.companyName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {profile?.industry}
            </p>
            {profile?.companyWebsite && (
              <a
                href={profile.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Visit Website
              </a>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{profile?.companyLocation || 'Location not specified'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{profile?.companySize || 'Company size not specified'}</span>
            </div>
            {profile?.companyFounded && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Founded in {profile.companyFounded}</span>
              </div>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl lg:col-span-2",
          "hover-effect"
        )}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About Us</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {profile?.companyDescription || 'No company description available.'}
              </p>
            </div>

            {profile?.companyMission && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {profile.companyMission}
                </p>
              </div>
            )}

            {profile?.companyCulture && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Company Culture</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {profile.companyCulture}
                </p>
              </div>
            )}

            {profile?.companyBenefits && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Benefits & Perks</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {profile.companyBenefits}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        {profile?.companySocialMedia && Object.values(profile.companySocialMedia).some(link => link) && (
          <div className={cn(
            "glass-effect p-6 rounded-2xl lg:col-span-3",
            "hover-effect"
          )}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-4">
              {profile.companySocialMedia.linkedin && (
                <a
                  href={profile.companySocialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.companySocialMedia.twitter && (
                <a
                  href={profile.companySocialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              )}
              {profile.companySocialMedia.facebook && (
                <a
                  href={profile.companySocialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfileDisplay; 