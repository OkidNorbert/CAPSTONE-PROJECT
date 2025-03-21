const { User } = require('../../models');
const path = require('path');

// Get company profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'email',
        'companyName',
        'industry',
        'companySize',
        'companyWebsite',
        'companyDescription',
        'companyLocation',
        'companyLogo',
        'companyMission',
        'companyCulture',
        'companyBenefits',
        'companySocialMedia',
        'companyFounded',
        'notificationPreferences',
        'privacySettings',
        'applicationSettings',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the response
    const formattedProfile = {
      id: user.id,
      email: user.email,
      companyName: user.companyName || '',
      industry: user.industry || '',
      size: user.companySize || '',
      website: user.companyWebsite || '',
      description: user.companyDescription || '',
      location: user.companyLocation || '',
      logo: user.companyLogo || '',
      mission: user.companyMission || '',
      culture: user.companyCulture || '',
      benefits: user.companyBenefits || '',
      founded: user.companyFounded || '',
      socialMedia: user.companySocialMedia ? JSON.parse(user.companySocialMedia) : {
        linkedin: '',
        twitter: '',
        facebook: '',
        website: ''
      },
      settings: {
        notificationPreferences: user.notificationPreferences ? JSON.parse(user.notificationPreferences) : {
          emailNotifications: true,
          applicationUpdates: true,
          marketingEmails: false
        },
        privacySettings: user.privacySettings ? JSON.parse(user.privacySettings) : {
          profileVisibility: 'public',
          contactInfoVisibility: 'public'
        },
        applicationSettings: user.applicationSettings ? JSON.parse(user.applicationSettings) : {
          autoReply: true,
          requireCoverLetter: false
        }
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(formattedProfile);
  } catch (error) {
    console.error('Error getting company profile:', error);
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
      socialMedia,
      notificationPreferences,
      privacySettings,
      applicationSettings
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update data
    const updateData = {
      companyName: companyName || user.companyName,
      industry: industry || user.industry,
      companySize: size || user.companySize,
      companyWebsite: website || user.companyWebsite,
      companyDescription: description || user.companyDescription,
      companyLocation: location || user.companyLocation,
      companyMission: mission || user.companyMission,
      companyCulture: culture || user.companyCulture,
      companyBenefits: benefits || user.companyBenefits,
      companyFounded: founded || user.companyFounded,
      companySocialMedia: socialMedia ? JSON.stringify(socialMedia) : user.companySocialMedia,
      notificationPreferences: notificationPreferences ? JSON.stringify(notificationPreferences) : user.notificationPreferences,
      privacySettings: privacySettings ? JSON.stringify(privacySettings) : user.privacySettings,
      applicationSettings: applicationSettings ? JSON.stringify(applicationSettings) : user.applicationSettings
    };

    await user.update(updateData);

    // Format the response
    const formattedProfile = {
      id: user.id,
      email: user.email,
      companyName: user.companyName || '',
      industry: user.industry || '',
      size: user.companySize || '',
      website: user.companyWebsite || '',
      description: user.companyDescription || '',
      location: user.companyLocation || '',
      logo: user.companyLogo || '',
      mission: user.companyMission || '',
      culture: user.companyCulture || '',
      benefits: user.companyBenefits || '',
      founded: user.companyFounded || '',
      socialMedia: user.companySocialMedia ? JSON.parse(user.companySocialMedia) : {
        linkedin: '',
        twitter: '',
        facebook: '',
        website: ''
      },
      settings: {
        notificationPreferences: user.notificationPreferences ? JSON.parse(user.notificationPreferences) : {
          emailNotifications: true,
          applicationUpdates: true,
          marketingEmails: false
        },
        privacySettings: user.privacySettings ? JSON.parse(user.privacySettings) : {
          profileVisibility: 'public',
          contactInfoVisibility: 'public'
        },
        applicationSettings: user.applicationSettings ? JSON.parse(user.applicationSettings) : {
          autoReply: true,
          requireCoverLetter: false
        }
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ 
      message: 'Company profile updated successfully', 
      profile: formattedProfile 
    });
  } catch (error) {
    console.error('Error updating company profile:', error);
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
      logo: logoUrl
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
