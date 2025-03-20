const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Application = require('../../models/application.model');
const { paginateResults, getSortOptions } = require('../../utils/helpers');

// Get all users with filters and pagination
exports.getUsers = async (req, res) => {
  try {
    const { page, limit, role, search, sortBy, sortOrder } = req.query;
    const { skip, limit: limitParsed } = paginateResults(page, limit);
    const sort = getSortOptions(sortBy, sortOrder);

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitParsed);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limitParsed)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user details with related data
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get additional data based on user role
    let additionalData = {};
    if (user.role === 'employer') {
      additionalData = {
        jobs: await Job.find({ company: user._id }).select('title status applications'),
        applications: await Application.find({ 'job.company': user._id })
          .populate('job', 'title')
          .populate('applicant', 'firstName lastName')
      };
    } else if (user.role === 'jobseeker') {
      additionalData = {
        applications: await Application.find({ applicant: user._id })
          .populate('job', 'title company')
      };
    }

    res.json({
      user,
      ...additionalData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status (active/inactive)
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status
    user.isActive = status;
    await user.save();

    // If deactivating user, handle related data
    if (!status) {
      if (user.role === 'employer') {
        // Update job statuses for this specific employer only
        await Job.updateMany(
          { company: user._id, status: { $ne: 'closed' } },
          { status: 'closed' }
        );
      }
    }

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user and related data
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete related data based on user role
    if (user.role === 'employer') {
      // Delete jobs and related applications
      const jobs = await Job.find({ company: user._id });
      for (const job of jobs) {
        await Application.deleteMany({ job: job._id });
      }
      await Job.deleteMany({ company: user._id });
    } else if (user.role === 'jobseeker') {
      // Delete applications
      await Application.deleteMany({ applicant: user._id });
    }

    // Delete user
    await user.remove();

    res.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
