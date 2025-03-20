import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateCompanyProfile, uploadCompanyLogo } from '../../../services/api/employer';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';
import ProfilePictureUpload from '../../shared/UI/ProfilePictureUpload';

const CompanyProfile = ({ initialData, onSaveSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    size: '',
    founded: '',
    website: '',
    description: '',
    mission: '',
    culture: '',
    benefits: '',
    location: '',
    logo: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: '',
      website: ''
    },
    settings: {
      notificationPreferences: {
        emailNotifications: true,
        applicationUpdates: true,
        marketingEmails: false
      },
      privacySettings: {
        profileVisibility: 'public',
        contactInfoVisibility: 'public'
      },
      applicationSettings: {
        autoReply: true,
        requireCoverLetter: false
      }
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        industry: initialData.industry || '',
        size: initialData.size || '',
        founded: initialData.founded || '',
        website: initialData.website || '',
        description: initialData.description || '',
        mission: initialData.mission || '',
        culture: initialData.culture || '',
        benefits: initialData.benefits || '',
        location: initialData.location || '',
        logo: initialData.logo || '',
        socialMedia: initialData.socialMedia || {
          linkedin: '',
          twitter: '',
          facebook: '',
          website: ''
        },
        settings: initialData.settings || {
          notificationPreferences: {
            emailNotifications: true,
            applicationUpdates: true,
            marketingEmails: false
          },
          privacySettings: {
            profileVisibility: 'public',
            contactInfoVisibility: 'public'
          },
          applicationSettings: {
            autoReply: true,
            requireCoverLetter: false
          }
        }
      });

      // Set initial logo preview if exists
      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      }
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.website.trim()) {
      newErrors.website = 'Website is required';
    } else {
      try {
        new URL(formData.website);
      } catch (e) {
        newErrors.website = 'Please enter a valid URL';
      }
    }

    // Validate social media URLs if provided
    Object.entries(formData.socialMedia).forEach(([platform, url]) => {
      if (url.trim()) {
        try {
          new URL(url);
        } catch (e) {
          newErrors[`socialMedia.${platform}`] = 'Please enter a valid URL';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear default values when user starts typing
    const clearDefaultValue = (val) => {
      const defaultValues = [
        'Not specified',
        'No company description available.',
        'No mission statement available.',
        'No culture information available.',
        'No benefits information available.'
      ];
      return defaultValues.includes(val) ? '' : val;
    };

    if (name.startsWith('socialMedia.')) {
      const socialMediaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialMediaField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? value : clearDefaultValue(prev[name])
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleLogoUpdate = (logoUrl) => {
    setLogoPreview(logoUrl);
    setFormData(prev => ({
      ...prev,
      logo: logoUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    try {
      setLoading(true);
      
      // Ensure all fields are properly formatted for the API
      const profileData = {
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
        size: formData.size === 'Not specified' ? '' : formData.size.trim(),
        founded: formData.founded === 'Not specified' ? '' : formData.founded.trim(),
        website: formData.website.trim(),
        description: formData.description === 'No company description available.' ? '' : formData.description.trim(),
        mission: formData.mission === 'No mission statement available.' ? '' : formData.mission.trim(),
        culture: formData.culture === 'No culture information available.' ? '' : formData.culture.trim(),
        benefits: formData.benefits === 'No benefits information available.' ? '' : formData.benefits.trim(),
        location: formData.location === 'Not specified' ? '' : formData.location.trim(),
        logo: formData.logo,
        socialLinks: JSON.stringify(formData.socialMedia),
        settings: JSON.stringify(formData.settings)
      };

      // Only include non-empty and non-default values
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => {
          return value !== '' && 
                 value !== 'Not specified' && 
                 value !== 'No company description available.' &&
                 value !== 'No mission statement available.' &&
                 value !== 'No culture information available.' &&
                 value !== 'No benefits information available.';
        })
      );

      await updateCompanyProfile(cleanedData);
      
      toast.success('Company profile updated successfully');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Company Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={cn(
                "bg-white dark:bg-gray-800 rounded-lg p-6",
                "border border-gray-200 dark:border-gray-700",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Logo</h2>
                <ProfilePictureUpload
                  currentPicture={logoPreview}
                  onUploadSuccess={handleLogoUpdate}
                  uploadFunction={uploadCompanyLogo}
                  className="mb-4"
                />
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors.companyName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                      required
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors.industry ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                      required
                    />
                    {errors.industry && (
                      <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Founded Year
                    </label>
                    <input
                      type="text"
                      name="founded"
                      value={formData.founded}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors.website ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                      required
                    />
                    {errors.website && (
                      <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors.location ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                      required
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Mission
                    </label>
                    <textarea
                      name="mission"
                      value={formData.mission}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Culture
                    </label>
                    <textarea
                      name="culture"
                      value={formData.culture}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Benefits & Perks
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors['socialMedia.linkedin'] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                    />
                    {errors['socialMedia.linkedin'] && (
                      <p className="mt-1 text-sm text-red-500">{errors['socialMedia.linkedin']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors['socialMedia.twitter'] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                    />
                    {errors['socialMedia.twitter'] && (
                      <p className="mt-1 text-sm text-red-500">{errors['socialMedia.twitter']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white",
                        errors['socialMedia.facebook'] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      )}
                    />
                    {errors['socialMedia.facebook'] && (
                      <p className="mt-1 text-sm text-red-500">{errors['socialMedia.facebook']}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Notifications
                    </label>
                    <input
                      type="checkbox"
                      name="settings.notificationPreferences.emailNotifications"
                      checked={formData.settings.notificationPreferences.emailNotifications}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Application Updates
                    </label>
                    <input
                      type="checkbox"
                      name="settings.notificationPreferences.applicationUpdates"
                      checked={formData.settings.notificationPreferences.applicationUpdates}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marketing Emails
                    </label>
                    <input
                      type="checkbox"
                      name="settings.notificationPreferences.marketingEmails"
                      checked={formData.settings.notificationPreferences.marketingEmails}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Visibility
                    </label>
                    <select
                      name="settings.privacySettings.profileVisibility"
                      value={formData.settings.privacySettings.profileVisibility}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Info Visibility
                    </label>
                    <select
                      name="settings.privacySettings.contactInfoVisibility"
                      value={formData.settings.privacySettings.contactInfoVisibility}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={cn(
                "glass-effect p-6 rounded-2xl",
                "hover-effect"
              )}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Auto Reply
                    </label>
                    <input
                      type="checkbox"
                      name="settings.applicationSettings.autoReply"
                      checked={formData.settings.applicationSettings.autoReply}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Require Cover Letter
                    </label>
                    <input
                      type="checkbox"
                      name="settings.applicationSettings.requireCoverLetter"
                      checked={formData.settings.applicationSettings.requireCoverLetter}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveSuccess}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;