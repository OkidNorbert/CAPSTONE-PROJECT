import React, { useState } from 'react';
import Card from '../../shared/UI/Card';
import InputField from '../../shared/Forms/InputField';
import FileUpload from '../../shared/Forms/FileUpload';
import Button from '../../shared/UI/Button';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    companyName: 'Tech Corp',
    industry: 'Information Technology',
    website: 'www.techcorp.com',
    size: '100-500',
    location: 'New York, NY',
    about: 'Leading technology solutions provider...'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="space-y-6">
      <Card title="Company Profile">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
            <InputField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
            <InputField
              label="Company Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Company
            </label>
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <FileUpload
            label="Company Logo"
            accept=".jpg,.png,.jpeg"
            onChange={(file) => console.log(file)}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyProfile;