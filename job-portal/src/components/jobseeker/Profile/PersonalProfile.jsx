import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../../services/api/profile';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const jobTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote'
];

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Design',
  'Sales',
  'Customer Service',
  'Other'
];

const commonSkills = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'HTML',
  'CSS',
  'TypeScript',
  'AWS',
  'Docker',
  'Git'
];

const PersonalProfile = ({ initialData, onSaveSuccess }) => {
  const [saving, setSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    headline: '',
    summary: '',
    profilePicture: '',
    skills: [],
    preferences: {
      jobTypes: [],
      locations: [],
      industries: [],
      salaryExpectation: '',
      isOpenToRemote: true
    },
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      console.log('Received initial data:', initialData);
      try {
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          phoneNumber: initialData.phoneNumber || '',
          location: initialData.location || '',
          headline: initialData.headline || '',
          summary: initialData.summary || '',
          profilePicture: initialData.profilePicture || '/default-avatar.png',
          skills: Array.isArray(initialData.skills) ? initialData.skills : [],
          preferences: {
            jobTypes: Array.isArray(initialData.preferences?.jobTypes) ? initialData.preferences.jobTypes : [],
            locations: Array.isArray(initialData.preferences?.locations) ? initialData.preferences.locations : [],
            industries: Array.isArray(initialData.preferences?.industries) ? initialData.preferences.industries : [],
            salaryExpectation: initialData.preferences?.salaryExpectation || '',
            isOpenToRemote: initialData.preferences?.isOpenToRemote ?? true
          },
          socialLinks: {
            linkedin: initialData.socialLinks?.linkedin || '',
            github: initialData.socialLinks?.github || '',
            portfolio: initialData.socialLinks?.portfolio || '',
            twitter: initialData.socialLinks?.twitter || ''
          }
        });
      } catch (error) {
        console.error('Error setting form data:', error);
        toast.error('Error loading profile data');
      }
    } else {
      console.log('No initial data received');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setProfilePicture(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (selectedSkill && !formData.skills.includes(selectedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, selectedSkill]
      }));
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleJobTypeToggle = (jobType) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        jobTypes: prev.preferences.jobTypes.includes(jobType)
          ? prev.preferences.jobTypes.filter(type => type !== jobType)
          : [...prev.preferences.jobTypes, jobType]
      }
    }));
  };

  const handleIndustryToggle = (industry) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        industries: prev.preferences.industries.includes(industry)
          ? prev.preferences.industries.filter(ind => ind !== industry)
          : [...prev.preferences.industries, industry]
      }
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      console.log('Submitting form data:', formData);
      
      // Create FormData object
      const submitData = new FormData();
      
      // Append profile picture if it exists
      if (profilePicture instanceof File) {
        submitData.append('profilePicture', profilePicture);
        console.log('Appending profile picture:', profilePicture.name);
      }
      
      // Append basic fields
      const basicFields = [
        'firstName', 'lastName', 'email', 'phoneNumber',
        'location', 'headline', 'summary'
      ];
      
      basicFields.forEach(field => {
        submitData.append(field, formData[field] || '');
        console.log(`Appending ${field}:`, formData[field]);
      });
      
      // Convert arrays and objects to JSON strings before appending
      submitData.append('skills', JSON.stringify(formData.skills || []));
      submitData.append('preferences', JSON.stringify({
        jobTypes: formData.preferences?.jobTypes || [],
        locations: formData.preferences?.locations || [],
        industries: formData.preferences?.industries || [],
        salaryExpectation: formData.preferences?.salaryExpectation || '',
        isOpenToRemote: formData.preferences?.isOpenToRemote ?? true
      }));
      submitData.append('socialLinks', JSON.stringify({
        linkedin: formData.socialLinks?.linkedin || '',
        github: formData.socialLinks?.github || '',
        portfolio: formData.socialLinks?.portfolio || '',
        twitter: formData.socialLinks?.twitter || ''
      }));

      console.log('Sending request to update profile...');
      const response = await updateUserProfile(submitData);
      console.log('Profile update response:', response);

      if (response.data) {
        toast.success('Profile updated successfully');
        if (onSaveSuccess) {
          onSaveSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      console.error('Error details:', error.response?.data);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture Section */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={formData.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover bg-gray-100"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Picture
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Maximum size: 5MB. Recommended: 400x400px</p>
      </div>

      {/* Basic Information */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input-field"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-field"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input-field"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input-field"
          />
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="Professional Headline"
            className="input-field"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Write a brief professional summary..."
          rows={4}
          className="input-field w-full"
        />
      </div>

      {/* Skills */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="input-field flex-grow"
            >
              <option value="">Select a skill or type custom</option>
              {commonSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              disabled={!selectedSkill}
            >
              Add Skill
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Job Preferences */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Types
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypeOptions.map(jobType => (
                <button
                  key={jobType}
                  type="button"
                  onClick={() => handleJobTypeToggle(jobType)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    formData.preferences.jobTypes.includes(jobType)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {jobType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map(industry => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => handleIndustryToggle(industry)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    formData.preferences.industries.includes(industry)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Salary Range
            </label>
            <input
              type="text"
              name="salaryExpectation"
              value={formData.preferences.salaryExpectation}
              onChange={handlePreferenceChange}
              placeholder="e.g., $50,000 - $70,000"
              className="input-field w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isOpenToRemote"
              checked={formData.preferences.isOpenToRemote}
              onChange={handlePreferenceChange}
              className="h-4 w-4 text-primary-600"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Open to remote work
            </label>
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
          <input
            type="url"
            name="linkedin"
            value={formData.socialLinks.linkedin}
            onChange={handleSocialLinkChange}
            placeholder="LinkedIn Profile URL"
            className="input-field"
          />
          <input
            type="url"
            name="github"
            value={formData.socialLinks.github}
            onChange={handleSocialLinkChange}
            placeholder="GitHub Profile URL"
            className="input-field"
          />
          <input
            type="url"
            name="portfolio"
            value={formData.socialLinks.portfolio}
            onChange={handleSocialLinkChange}
            placeholder="Portfolio Website URL"
            className="input-field"
          />
          <input
            type="url"
            name="twitter"
            value={formData.socialLinks.twitter}
            onChange={handleSocialLinkChange}
            placeholder="Twitter Profile URL"
            className="input-field"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default PersonalProfile;