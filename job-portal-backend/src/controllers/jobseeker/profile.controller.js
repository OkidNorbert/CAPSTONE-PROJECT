const { User } = require('../../models');
const { uploadFile } = require('../../services/storage.service');

// Helper functions
const safeParseJSON = (value, defaultValue) => {
  if (!value || value === 'undefined' || value === 'null') {
    return defaultValue;
  }
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (e) {
    return defaultValue;
  }
};

const safeStringifyJSON = (value) => {
  if (!value) return null;
  return typeof value === 'string' ? value : JSON.stringify(value);
};

// Get jobseeker profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'role',
        'profilePicture', 'headline', 'summary', 'phoneNumber',
        'location', 'resume', 'skills', 'experience',
        'educationHistory', 'certifications', 'languages',
        'preferences', 'socialLinks', 'isEmailVerified',
        'createdAt', 'updatedAt'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse JSON fields
    const profile = {
      ...user.toJSON(),
      skills: safeParseJSON(user.skills, []),
      experience: safeParseJSON(user.experience, []),
      educationHistory: safeParseJSON(user.educationHistory, []),
      certifications: safeParseJSON(user.certifications, []),
      languages: safeParseJSON(user.languages, []),
      preferences: safeParseJSON(user.preferences, {
        jobTypes: [],
        locations: [],
        industries: [],
        salaryExpectation: '',
        isOpenToRemote: true
      }),
      socialLinks: safeParseJSON(user.socialLinks, {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: ''
      })
    };

    res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update jobseeker profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract and validate fields
    const {
      firstName,
      lastName,
      headline,
      summary,
      phoneNumber,
      location,
      skills,
      experience,
      educationHistory,
      certifications,
      languages,
      preferences,
      socialLinks
    } = req.body;

    // Handle file upload if present
    let profilePicture = user.profilePicture;
    if (req.file) {
      profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    // Update user with properly stringified JSON
    await user.update({
      firstName,
      lastName,
      headline,
      summary,
      phoneNumber,
      location,
      profilePicture,
      skills: safeStringifyJSON(skills),
      experience: safeStringifyJSON(experience),
      educationHistory: safeStringifyJSON(educationHistory),
      certifications: safeStringifyJSON(certifications),
      languages: safeStringifyJSON(languages),
      preferences: safeStringifyJSON(preferences),
      socialLinks: safeStringifyJSON(socialLinks)
    });

    // Return the updated profile with parsed JSON
    const updatedProfile = {
      ...user.toJSON(),
      skills: safeParseJSON(user.skills, []),
      experience: safeParseJSON(user.experience, []),
      educationHistory: safeParseJSON(user.educationHistory, []),
      certifications: safeParseJSON(user.certifications, []),
      languages: safeParseJSON(user.languages, []),
      preferences: safeParseJSON(user.preferences, {
        jobTypes: [],
        locations: [],
        industries: [],
        salaryExpectation: '',
        isOpenToRemote: true
      }),
      socialLinks: safeParseJSON(user.socialLinks, {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: ''
      })
    };

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the resume URL
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    // Update resume URL
    await user.update({ resume: resumeUrl });

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the profile picture URL
    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

    // Update profile picture URL
    await user.update({ profilePicture: profilePictureUrl });

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePictureUrl
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ preferences });

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
};

// Update social links
exports.updateSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ socialLinks });

    res.json({
      message: 'Social links updated successfully',
      socialLinks: user.socialLinks
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    res.status(500).json({ message: 'Failed to update social links' });
  }
};

// Add education
exports.addEducation = async (req, res) => {
  try {
    const {
      institution,
      degree,
      field,
      startDate,
      endDate,
      grade,
      activities,
      description
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add education entry
    const educationHistory = user.educationHistory || [];
    educationHistory.push({
      institution,
      degree,
      field,
      startDate,
      endDate,
      grade,
      activities,
      description
    });

    await user.update({ educationHistory });
    res.status(201).json({
      message: 'Education added successfully',
      educationHistory: user.educationHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update education
exports.updateEducation = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const educationHistory = user.educationHistory || [];
    const educationIndex = educationHistory.findIndex(
      edu => edu.id === req.params.id
    );

    if (educationIndex === -1) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    // Update education entry
    educationHistory[educationIndex] = {
      ...educationHistory[educationIndex],
      ...req.body
    };

    await user.update({ educationHistory });
    res.json({
      message: 'Education updated successfully',
      education: educationHistory[educationIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user resumes
exports.getResumes = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['resume']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse resumes from JSON string
    const resumes = safeParseJSON(user.resume, []);
    
    // Map resumes to include necessary information
    const formattedResumes = resumes.map(resume => ({
      id: resume.id,
      name: resume.originalName,
      url: resume.url,
      uploadedAt: resume.uploadedAt
    }));

    res.json(formattedResumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
};