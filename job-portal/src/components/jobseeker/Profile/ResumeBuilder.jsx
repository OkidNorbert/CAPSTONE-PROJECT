import React, { useState } from 'react';
import { cn } from '../../../utils/styles';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [
      {
        id: 1,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ],
    education: [
      {
        id: 1,
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ],
    skills: [''],
    certifications: [
      {
        id: 1,
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        url: '',
      },
    ],
  });

  const addItem = (section) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [
        ...prev[section],
        {
          id: prev[section].length + 1,
          ...(section === 'experience' ? {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          } : section === 'education' ? {
            school: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          } : {
            name: '',
            issuer: '',
            date: '',
            expiryDate: '',
            url: '',
          }),
        },
      ],
    }));
  };

  const removeItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id),
    }));
  };

  const handleChange = (section, id, field, value) => {
    if (section === 'personalInfo') {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    } else if (section === 'skills') {
      setResumeData(prev => ({
        ...prev,
        skills: value.split(',').map(skill => skill.trim()),
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [section]: prev[section].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Resume data:', resumeData);
    // TODO: Save resume data
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Resume Builder
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => handleChange('personalInfo', null, 'fullName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handleChange('personalInfo', null, 'email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="tel"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handleChange('personalInfo', null, 'phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => handleChange('personalInfo', null, 'location', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Professional Summary
              </label>
              <textarea
                rows={4}
                value={resumeData.personalInfo.summary}
                onChange={(e) => handleChange('personalInfo', null, 'summary', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Work Experience
            </h3>
            <button
              type="button"
              onClick={() => addItem('experience')}
              className={cn(
                "button-gradient px-4 py-2 rounded-full",
                "text-sm font-medium",
                "hover-effect"
              )}
            >
              Add Experience
            </button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="mb-6 last:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleChange('experience', exp.id, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleChange('experience', exp.id, 'company', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleChange('experience', exp.id, 'startDate', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => handleChange('experience', exp.id, 'endDate', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => handleChange('experience', exp.id, 'description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem('experience', exp.id)}
                  className="mt-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Education */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Education
            </h3>
            <button
              type="button"
              onClick={() => addItem('education')}
              className={cn(
                "button-gradient px-4 py-2 rounded-full",
                "text-sm font-medium",
                "hover-effect"
              )}
            >
              Add Education
            </button>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="mb-6 last:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    School
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleChange('education', edu.id, 'school', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleChange('education', edu.id, 'degree', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => handleChange('education', edu.id, 'field', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Graduation Date
                  </label>
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleChange('education', edu.id, 'endDate', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItem('education', edu.id)}
                  className="mt-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className={cn(
          "glass-effect p-6 rounded-2xl",
          "hover-effect"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skills
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Skills (comma-separated)
            </label>
            <textarea
              rows={3}
              value={resumeData.skills.join(', ')}
              onChange={(e) => handleChange('skills', null, null, e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className={cn(
              "px-6 py-2 rounded-full",
              "text-sm font-medium",
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "hover-effect"
            )}
          >
            Preview
          </button>
          <button
            type="submit"
            className={cn(
              "button-gradient px-6 py-2 rounded-full",
              "text-sm font-medium",
              "hover-effect"
            )}
          >
            Save Resume
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeBuilder;

