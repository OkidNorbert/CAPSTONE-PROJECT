const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/profiles',
    'uploads/resumes',
    'uploads/companies'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure multer for profile picture uploads
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles');
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and random number
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    cb(null, `${timestamp}_${random}${path.extname(file.originalname)}`);
  }
});

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and random number
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    cb(null, `${timestamp}_${random}${path.extname(file.originalname)}`);
  }
});

// Configure multer for company logo uploads
const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/companies');
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp and random number
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    cb(null, `${timestamp}_${random}${path.extname(file.originalname)}`);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Please upload PDF or Word documents only.'), false);
  }
};

const uploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('profilePicture');

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for resumes
  }
}).single('resume');

const uploadCompanyLogo = multer({
  storage: companyStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('profilePicture');

// Wrapper middleware functions that combine upload and error handling
const uploadProfilePictureMiddleware = (req, res, next) => {
  uploadProfilePicture(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

const uploadResumeMiddleware = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

const uploadCompanyLogoMiddleware = (req, res, next) => {
  uploadCompanyLogo(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

module.exports = {
  uploadProfilePicture: uploadProfilePictureMiddleware,
  uploadResume: uploadResumeMiddleware,
  uploadCompanyLogo: uploadCompanyLogoMiddleware
};