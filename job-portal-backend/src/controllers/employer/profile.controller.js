const { User } = require('../../models');
const path = require('path');

// Get company profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company profile
exports.updateCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      size,
      founded,
      website,
      description,
      mission,
      culture,
      benefits,
      location,
      socialMedia
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      companyName,
      industry,
      companyWebsite: website,
      companyDescription: description,
      companySize: size,
      companyLocation: location,
      companyMission: mission,
      companyCulture: culture,
      companyBenefits: benefits,
      companySocialMedia: socialMedia,
      companyFounded: founded
    });

    res.json({ message: 'Company profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle logo upload
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the logo URL
    const logoUrl = `/uploads/companies/${req.file.filename}`;

    // Update user with logo URL
    await user.update({
      companyLogo: logoUrl
    });

    res.json({
      message: 'Logo uploaded successfully',
      logoUrl
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ message: 'Error uploading logo' });
  }
};

// Update company settings
exports.updateCompanySettings = async (req, res) => {
  try {
    const {
      notificationPreferences,
      privacySettings,
      applicationSettings
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      notificationPreferences,
      privacySettings,
      applicationSettings
    });

    res.json({
      message: 'Company settings updated successfully',
      settings: {
        notificationPreferences,
        privacySettings,
        applicationSettings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
