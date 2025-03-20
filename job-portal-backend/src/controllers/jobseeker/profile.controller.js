const User = require('../../models/user.model');
const { uploadFile } = require('../../services/storage.service');

// Get jobseeker profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('education')
      .populate('experience');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      skills,
      location,
      phoneNumber,
      socialMedia
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile information
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profile = {
      ...user.profile,
      headline,
      summary,
      skills,
      location,
      phoneNumber,
      socialMedia
    };

    await user.save();
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload resume to storage
    const resumeUrl = await uploadFile(req.file, 'resumes');

    // Update resume URL
    user.profile.resume = resumeUrl;
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add education entry
    user.education.push({
      institution,
      degree,
      field,
      startDate,
      endDate,
      grade,
      activities,
      description
    });

    await user.save();
    res.status(201).json({
      message: 'Education added successfully',
      education: user.education
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update education
exports.updateEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const educationIndex = user.education.findIndex(
      edu => edu._id.toString() === req.params.id
    );

    if (educationIndex === -1) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    // Update education entry
    user.education[educationIndex] = {
      ...user.education[educationIndex],
      ...req.body
    };

    await user.save();
    res.json({
      message: 'Education updated successfully',
      education: user.education[educationIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete education
exports.deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.education = user.education.filter(
      edu => edu._id.toString() !== req.params.id
    );

    await user.save();
    res.json({
      message: 'Education deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add experience
exports.addExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      achievements
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add experience entry
    user.experience.push({
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      achievements
    });

    await user.save();
    res.status(201).json({
      message: 'Experience added successfully',
      experience: user.experience
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const experienceIndex = user.experience.findIndex(
      exp => exp._id.toString() === req.params.id
    );

    if (experienceIndex === -1) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    // Update experience entry
    user.experience[experienceIndex] = {
      ...user.experience[experienceIndex],
      ...req.body
    };

    await user.save();
    res.json({
      message: 'Experience updated successfully',
      experience: user.experience[experienceIndex]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.experience = user.experience.filter(
      exp => exp._id.toString() !== req.params.id
    );

    await user.save();
    res.json({
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update skills
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update skills
    user.profile.skills = skills;
    await user.save();

    res.json({
      message: 'Skills updated successfully',
      skills: user.profile.skills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
