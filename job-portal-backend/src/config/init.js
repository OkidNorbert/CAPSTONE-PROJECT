const fs = require('fs');
const path = require('path');

// Create necessary directories for file uploads
const createUploadDirectories = () => {
  const directories = [
    'uploads',
    'uploads/resumes',
    'uploads/profiles',
    'uploads/companies',
    'uploads/documents'
  ];

  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  });
};

module.exports = {
  createUploadDirectories
}; 