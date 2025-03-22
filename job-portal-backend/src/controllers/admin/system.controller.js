const { User, Job, Application, Category } = require('../../models');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.count(),
        jobseekers: await User.count({ where: { role: 'jobseeker' } }),
        employers: await User.count({ where: { role: 'employer' } })
      },
      jobs: {
        total: await Job.count(),
        active: await Job.count({ where: { status: 'published' } }),
        draft: await Job.count({ where: { status: 'draft' } }),
        closed: await Job.count({ where: { status: 'closed' } })
      },
      applications: {
        total: await Application.count(),
        pending: await Application.count({ where: { status: 'pending' } }),
        reviewing: await Application.count({ where: { status: 'reviewing' } }),
        shortlisted: await Application.count({ where: { status: 'shortlisted' } }),
        accepted: await Application.count({ where: { status: 'accepted' } }),
        rejected: await Application.count({ where: { status: 'rejected' } })
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
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
        const categories = await Category.findAll({
          include: [{
            model: Category,
            as: 'parentCategory',
            attributes: ['id', 'name']
          }],
          order: [['name', 'ASC']]
        });
        return res.json(categories);

      case 'POST':
        const newCategory = await Category.create({
          ...req.body,
          createdBy: req.user.id
        });
        return res.status(201).json(newCategory);

      case 'PUT':
        const [updated] = await Category.update(
          { 
            ...req.body,
            updatedAt: new Date()
          },
          { 
            where: { id },
            returning: true
          }
        );
        
        if (!updated) {
          return res.status(404).json({ message: 'Category not found' });
        }
        
        const updatedCategory = await Category.findByPk(id);
        return res.json(updatedCategory);

      case 'DELETE':
        const deleted = await Category.destroy({
          where: { id }
        });
        
        if (!deleted) {
          return res.status(404).json({ message: 'Category not found' });
        }
        return res.json({ message: 'Category deleted successfully' });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error managing categories:', error);
    res.status(500).json({ message: error.message });
  }
};