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

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'role',
        'profilePicture', 'phoneNumber', 'isEmailVerified',
        'createdAt', 'updatedAt'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure role is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting admin profile:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure role is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Extract and validate fields
    const {
      firstName,
      lastName,
      phoneNumber
    } = req.body;

    // Update user
    await user.update({
      firstName,
      lastName,
      phoneNumber
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
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

    // Ensure role is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create the profile picture URL
    const profilePictureUrl = `/uploads/admin/profiles/${req.file.filename}`;

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