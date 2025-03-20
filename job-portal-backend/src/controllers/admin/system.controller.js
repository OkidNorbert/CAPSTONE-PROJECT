const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Application = require('../../models/application.model');
const Category = require('../../models/Category.model');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        jobseekers: await User.countDocuments({ role: 'jobseeker' }),
        employers: await User.countDocuments({ role: 'employer' })
      },
      jobs: {
        total: await Job.countDocuments(),
        active: await Job.countDocuments({ status: 'published' }),
        draft: await Job.countDocuments({ status: 'draft' }),
        closed: await Job.countDocuments({ status: 'closed' })
      },
      applications: {
        total: await Application.countDocuments(),
        pending: await Application.countDocuments({ status: 'pending' }),
        reviewing: await Application.countDocuments({ status: 'reviewing' }),
        shortlisted: await Application.countDocuments({ status: 'shortlisted' }),
        accepted: await Application.countDocuments({ status: 'accepted' }),
        rejected: await Application.countDocuments({ status: 'rejected' })
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system configuration
exports.getSystemConfig = async (req, res) => {
  try {
    // Implement system configuration retrieval
    const config = {
      maintenance: false,
      jobPostingEnabled: true,
      applicationEnabled: true,
      maxJobsPerEmployer: 10,
      maxApplicationsPerJobseeker: 50,
      fileUploadLimits: {
        resume: 5 * 1024 * 1024, // 5MB
        profilePicture: 2 * 1024 * 1024, // 2MB
        companyLogo: 2 * 1024 * 1024 // 2MB
      },
      emailNotifications: {
        applicationUpdates: true,
        jobAlerts: true,
        systemAnnouncements: true
      }
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update system configuration
exports.updateSystemConfig = async (req, res) => {
  try {
    const config = req.body;
    // Implement system configuration update
    // This would typically involve updating a configuration in the database
    
    res.json({ message: 'System configuration updated', config });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage categories
exports.manageCategories = async (req, res) => {
  try {
    const { method } = req;
    const { id } = req.params;

    switch (method) {
      case 'GET':
        const categories = await Category.find()
          .populate('parentCategory', 'name')
          .sort('name');
        return res.json(categories);

      case 'POST':
        const newCategory = new Category({
          ...req.body,
          createdBy: req.user.id
        });
        await newCategory.save();
        return res.status(201).json(newCategory);

      case 'PUT':
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: Date.now() },
          { new: true }
        );
        if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
        }
        return res.json(updatedCategory);

      case 'DELETE':
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
          return res.status(404).json({ message: 'Category not found' });
        }
        return res.json({ message: 'Category deleted successfully' });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};