const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Base upload directory
const UPLOAD_DIR = 'uploads';

// Ensure upload directories exist
const createUploadDirs = async () => {
  const dirs = ['resumes', 'profiles', 'companies', 'documents'].map(dir => 
    path.join(UPLOAD_DIR, dir)
  );

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_DIR;
    
    switch (file.fieldname) {
      case 'resume':
        uploadPath = path.join(UPLOAD_DIR, 'resumes');
        break;
      case 'profilePicture':
        uploadPath = path.join(UPLOAD_DIR, 'profiles');
        break;
      case 'companyLogo':
        uploadPath = path.join(UPLOAD_DIR, 'companies');
        break;
      default:
        uploadPath = path.join(UPLOAD_DIR, 'documents');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    profilePicture: ['image/jpeg', 'image/png', 'image/gif'],
    companyLogo: ['image/jpeg', 'image/png', 'image/gif'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  };

  const allowed = allowedTypes[file.fieldname] || allowedTypes.documents;
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowed.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Delete file
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file URL
const getFileUrl = (filename, type) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${type}/${filename}`;
};

/**
 * Upload a file to the specified directory
 * @param {Object} file - The file object from multer
 * @param {String} directory - The directory to upload to (optional)
 * @returns {Promise<String>} - The file path
 */
exports.uploadFile = async (file, directory = 'uploads') => {
  try {
    // File is already uploaded by multer middleware
    // Just return the path
    return file.path;
  } catch (error) {
    console.error('Error in uploadFile service:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete a file from storage
 * @param {String} filePath - The path of the file to delete
 * @returns {Promise<Boolean>} - True if successful
 */
exports.deleteFile = async (filePath) => {
  try {
    if (!filePath) return false;
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete file
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in deleteFile service:', error);
    return false;
  }
};

module.exports = {
  upload,
  deleteFile,
  getFileUrl
};
