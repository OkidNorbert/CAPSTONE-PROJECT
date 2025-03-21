const { Job, Application, User } = require('../../models');
const { Op } = require('sequelize');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get company's jobs with more details
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      attributes: ['id', 'title', 'status', 'views', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    const jobIds = jobs.map(job => job.id);

    // Get active jobs count
    const activeJobs = jobs.filter(job => job.status === 'published').length;

    // Get total applications count
    const totalApplications = jobIds.length > 0 ? await Application.count({
      where: {
        jobId: {
          [Op.in]: jobIds
        }
      }
    }) : 0;

    // Get new applications count (last 24 hours)
    const newApplications = jobIds.length > 0 ? await Application.count({
      where: {
        jobId: {
          [Op.in]: jobIds
        },
        createdAt: {
          [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }
    }) : 0;

    // Get total views
    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    res.json({
      activeJobs,
      totalApplications,
      newApplications,
      totalViews,
      recentJobs: jobs
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard statistics',
      error: error.message 
    });
  }
};

// Get recent applications
exports.getRecentApplications = async (req, res) => {
  try {
    // First check if the employer has any jobs
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      attributes: ['id']
    });

    if (jobs.length === 0) {
      return res.json([]); // Return empty array if no jobs exist
    }

    const jobIds = jobs.map(job => job.id);

    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          as: 'job',
          where: { 
            id: {
              [Op.in]: jobIds
            }
          },
          attributes: ['id', 'title', 'location', 'type', 'status']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
        }
      ],
      attributes: ['id', 'status', 'resumePath', 'coverLetter', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json(applications);
  } catch (error) {
    console.error('Error getting recent applications:', error);
    res.status(500).json({ 
      message: 'Failed to fetch recent applications',
      error: error.message 
    });
  }
}; 