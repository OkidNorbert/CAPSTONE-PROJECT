const { Job, Application, User } = require('../../models');
const { Op } = require('sequelize');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get company's job IDs
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      attributes: ['id']
    });
    
    const jobIds = jobs.map(job => job.id);

    // Get active jobs count
    const activeJobs = await Job.count({
      where: {
        companyId: req.user.id,
        status: 'published'
      }
    });

    // Get total applications count
    const totalApplications = await Application.count({
      where: {
        jobId: {
          [Op.in]: jobIds
        }
      }
    });

    // Get new applications count (last 24 hours)
    const newApplications = await Application.count({
      where: {
        jobId: {
          [Op.in]: jobIds
        },
        createdAt: {
          [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get views today (implement view tracking in your Job model first)
    const viewsToday = await Job.sum('viewsToday', {
      where: {
        companyId: req.user.id
      }
    }) || 0;

    res.json({
      activeJobs,
      totalApplications,
      newApplications,
      viewsToday
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get recent applications
exports.getRecentApplications = async (req, res) => {
  try {
    // Get company's job IDs
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      attributes: ['id']
    });
    
    const jobIds = jobs.map(job => job.id);

    // Get recent applications
    const applications = await Application.findAll({
      where: {
        jobId: {
          [Op.in]: jobIds
        }
      },
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'location', 'type']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json(applications);
  } catch (error) {
    console.error('Error getting recent applications:', error);
    res.status(500).json({ message: error.message });
  }
}; 