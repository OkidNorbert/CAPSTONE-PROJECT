const { User } = require('../../models');
const { uploadFile } = require('../../services/storage.service');

// Get jobseeker profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires']
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Update jobseeker profile
exports.updateProfile = async (req, res) => {
  try {
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

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile information
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      headline: headline || user.headline,
      summary: summary || user.summary,
      phoneNumber: phoneNumber || user.phoneNumber,
      location: location || user.location,
      skills: skills || user.skills,
      experience: experience || user.experience,
      educationHistory: educationHistory || user.educationHistory,
      certifications: certifications || user.certifications,
      languages: languages || user.languages,
      preferences: preferences || user.preferences,
      socialLinks: socialLinks || user.socialLinks
    });

    res.json({
      message: 'Profile updated successfully',
      user: user.toPublicJSON()
    });
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