const { User, Job, Application } = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

// Get activity report
exports.getActivityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {
      createdAt: {
        [Op.between]: [
          startDate || new Date(new Date().setDate(new Date().getDate() - 30)),
          endDate || new Date()
        ]
      }
    };

    const [newUsers, newJobs, newApplications] = await Promise.all([
      User.count({ where: dateFilter }),
      Job.count({ where: dateFilter }),
      Application.count({ where: dateFilter })
    ]);

    // Get daily activity counts
    const [userActivity, jobActivity, applicationActivity] = await Promise.all([
      User.findAll({
        attributes: [
          [fn('date', col('createdAt')), 'date'],
          [fn('count', '*'), 'count']
        ],
        where: dateFilter,
        group: [fn('date', col('createdAt'))],
        order: [[fn('date', col('createdAt')), 'ASC']]
      }),
      Job.findAll({
        attributes: [
          [fn('date', col('createdAt')), 'date'],
          [fn('count', '*'), 'count']
        ],
        where: dateFilter,
        group: [fn('date', col('createdAt'))],
        order: [[fn('date', col('createdAt')), 'ASC']]
      }),
      Application.findAll({
        attributes: [
          [fn('date', col('createdAt')), 'date'],
          [fn('count', '*'), 'count']
        ],
        where: dateFilter,
        group: [fn('date', col('createdAt'))],
        order: [[fn('date', col('createdAt')), 'ASC']]
      })
    ]);

    res.json({
      summary: {
        newUsers,
        newJobs,
        newApplications
      },
      dailyActivity: {
        users: userActivity,
        jobs: jobActivity,
        applications: applicationActivity
      }
    });
  } catch (error) {
    console.error('Error getting activity report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get job report
exports.getJobReport = async (req, res) => {
  try {
    const [totalJobs, activeJobs, closedJobs] = await Promise.all([
      Job.count(),
      Job.count({ where: { status: 'active' } }),
      Job.count({ where: { status: 'closed' } })
    ]);

    // Get jobs by category
    const jobsByCategory = await Job.findAll({
      attributes: [
        'category',
        [fn('count', '*'), 'count']
      ],
      group: ['category']
    });

    // Get jobs by location
    const jobsByLocation = await Job.findAll({
      attributes: [
        'location',
        [fn('count', '*'), 'count']
      ],
      group: ['location']
    });

    // Get application statistics by job
    const applicationStats = await Job.findAll({
      attributes: [
        'id',
        'title',
        [fn('count', col('applications.id')), 'applicationCount']
      ],
      include: [{
        model: Application,
        as: 'applications',
        attributes: []
      }],
      group: ['Job.id', 'Job.title']
    });

    res.json({
      summary: {
        totalJobs,
        activeJobs,
        closedJobs
      },
      jobsByCategory,
      jobsByLocation,
      applicationStats
    });
  } catch (error) {
    console.error('Error getting job report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user report
exports.getUserReport = async (req, res) => {
  try {
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [fn('count', '*'), 'count']
      ],
      group: ['role']
    });

    const [activeUsers, inactiveUsers] = await Promise.all([
      User.count({ where: { isActive: true } }),
      User.count({ where: { isActive: false } })
    ]);

    const registrationTrends = await User.findAll({
      attributes: [
        [fn('date_trunc', 'month', col('createdAt')), 'month'],
        [fn('count', '*'), 'count']
      ],
      group: [fn('date_trunc', 'month', col('createdAt'))],
      order: [[fn('date_trunc', 'month', col('createdAt')), 'ASC']]
    });

    res.json({
      usersByRole,
      userStatus: {
        active: activeUsers,
        inactive: inactiveUsers
      },
      registrationTrends
    });
  } catch (error) {
    console.error('Error getting user report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get financial report
exports.getFinancialReport = async (req, res) => {
  try {
    // Placeholder for financial reporting
    // This would typically involve payment/subscription data
    res.json({
      message: 'Financial reporting coming soon'
    });
  } catch (error) {
    console.error('Error getting financial report:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export report data
exports.exportReport = async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    switch (type) {
      case 'users':
        data = await User.findAll({
          attributes: { exclude: ['password'] }
        });
        break;
      case 'jobs':
        data = await Job.findAll({
          include: [{
            model: User,
            as: 'company',
            attributes: ['companyName']
          }]
        });
        break;
      case 'applications':
        data = await Application.findAll({
          include: [
            {
              model: Job,
              as: 'job',
              attributes: ['title']
            },
            {
              model: User,
              as: 'applicant',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({
      type,
      data,
      exportedAt: new Date()
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ message: error.message });
  }
}; 