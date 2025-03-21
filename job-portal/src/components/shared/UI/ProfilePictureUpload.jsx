import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import { cn } from '../../../utils/styles';

const ProfilePictureUpload = ({ 
  currentPicture, 
  onUploadSuccess, 
  uploadFunction,
  className 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPicture);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const response = await uploadFunction(formData);
      
      // Handle both profilePictureUrl and logo response fields
      const uploadedUrl = response.profilePictureUrl || response.logo;
      
      if (uploadedUrl) {
        setPreview(uploadedUrl);
        onUploadSuccess(uploadedUrl);
        toast.success('Profile picture uploaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
      // Reset preview on error
      setPreview(currentPicture);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess(null);
  };

  return (
    <div className={cn("flex items-center space-x-6", className)}>
      <div className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            ref={fileInputRef}
            disabled={uploading}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
          {preview && (
            <Button
              variant="text"
              onClick={handleRemove}
              disabled={uploading}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Remove
            </Button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload; 