import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { uploadResume, deleteResume } from '../../../services/api/profile';
import Button from '../../shared/UI/Button';
import { cn } from '../../../utils/styles';

const ResumeUpload = ({ onUploadSuccess, existingResumes = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF or Word document.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('name', file.name);

      const response = await uploadResume(formData);
      toast.success('Resume uploaded successfully!');
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      setDeleting(true);
      await deleteResume(resumeId);
      toast.success('Resume deleted successfully!');
      if (onUploadSuccess) {
        onUploadSuccess(existingResumes.filter(resume => resume.id !== resumeId));
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          "transition-colors duration-200",
          isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300",
          "hover:border-primary-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
        
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">
            📄
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop your resume here, or
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              browse to upload
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOC, DOCX (Max size: 5MB)
          </p>
        </div>
      </div>

      {existingResumes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploaded Resumes
          </h3>
          <div className="space-y-2">
            {existingResumes.map(resume => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📄</div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {resume.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(resume.path, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deleting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 