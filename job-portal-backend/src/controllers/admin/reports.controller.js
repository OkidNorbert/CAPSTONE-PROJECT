const User = require('../../models/user.model');
const Job = require('../../models/job.model');
const Application = require('../../models/application.model');
const { formatDate } = require('../../utils/helpers');

// Get activity report
exports.getActivityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {
      createdAt: {
        $gte: new Date(startDate || new Date().setDate(new Date().getDate() - 30)),
        $lte: new Date(endDate || new Date())
      }
    };

    const [newUsers, newJobs, newApplications] = await Promise.all([
      User.countDocuments({ ...dateFilter }),
      Job.countDocuments({ ...dateFilter }),
      Application.countDocuments({ ...dateFilter })
    ]);

    // Get daily activity counts
    const dailyActivity = await Promise.all([
      User.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ]),
      Job.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ]),
      Application.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      summary: {
        newUsers,
        newJobs,
        newApplications
      },
      dailyActivity: {
        users: dailyActivity[0],
        jobs: dailyActivity[1],
        applications: dailyActivity[2]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get jobs report
exports.getJobsReport = async (req, res) => {
  try {
    // Get job statistics
    const [totalJobs, activeJobs, closedJobs] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Job.countDocuments({ status: 'closed' })
    ]);

    // Get jobs by category
    const jobsByCategory = await Job.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get jobs by location
    const jobsByLocation = await Job.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get application statistics by job
    const applicationStats = await Job.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications'
        }
      },
      {
        $project: {
          title: 1,
          company: 1,
          applicationCount: { $size: '$applications' }
        }
      }
    ]);

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
    res.status(500).json({ message: error.message });
  }
};

// Get users report
exports.getUsersReport = async (req, res) => {
  try {
    // Get user statistics by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get active vs inactive users
    const [activeUsers, inactiveUsers] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false })
    ]);

    // Get user registration trends
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      usersByRole,
      userStatus: {
        active: activeUsers,
        inactive: inactiveUsers
      },
      registrationTrends
    });
  } catch (error) {
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
        data = await User.find().select('-password');
        break;
      case 'jobs':
        data = await Job.find().populate('company', 'name');
        break;
      case 'applications':
        data = await Application.find()
          .populate('job', 'title')
          .populate('applicant', 'firstName lastName email');
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    // Format data for export
    const formattedData = data.map(item => {
      const formatted = { ...item.toObject() };
      formatted.createdAt = formatDate(item.createdAt);
      if (formatted.updatedAt) {
        formatted.updatedAt = formatDate(item.updatedAt);
      }
      return formatted;
    });

    res.json({
      type,
      data: formattedData,
      exportedAt: formatDate(new Date())
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 