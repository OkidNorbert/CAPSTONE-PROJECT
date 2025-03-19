import React, { useRef, useState } from 'react';
import Button from '../UI/Button';

const FileUpload = ({
  label,
  accept = '.pdf,.doc,.docx',
  onChange,
  error,
  maxSize = 5, // in MB
  className = ''
}) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size should not exceed ${maxSize}MB`);
        return;
      }
      setFileName(file.name);
      onChange?.(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </Button>
        <span className="text-sm text-gray-500">
          {fileName || 'No file chosen'}
        </span>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <p className="text-xs text-gray-500">
        Accepted formats: {accept.replace(/\./g, '').toUpperCase()}. Max size: {maxSize}MB
      </p>
    </div>
  );
};

export default FileUpload;