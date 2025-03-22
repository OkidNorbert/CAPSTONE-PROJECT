const { Job, User, Application } = require('../../models');
const { Op } = require('sequelize');

// Get all jobs with pagination, filtering, and sorting
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Build order array
    const order = [[sortBy, sortOrder]];

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'companyName', 'email']
        },
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status']
        }
      ],
      order,
      offset,
      limit: parseInt(limit)
    });

    res.json({
      jobs,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update job status
exports.updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.update({ status });
    res.json({ message: 'Job status updated successfully', job });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: error.message });
  }
}; 