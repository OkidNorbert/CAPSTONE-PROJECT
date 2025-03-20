const { Job, User, Application } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      type,
      industry,
      experience,
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {
      status: 'published'
    };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (type) {
      whereClause.type = type;
    }

    if (industry) {
      whereClause.industry = industry;
    }

    if (experience) {
      whereClause.experienceMin = { [Op.lte]: parseInt(experience) };
      whereClause.experienceMax = { [Op.gte]: parseInt(experience) };
    }

    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo', 'industry', 'companyLocation']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      jobs: jobs.rows,
      total: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: 'Failed to get jobs' });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo', 'companyDescription', 'industry', 'companyLocation', 'companyWebsite']
      }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ message: 'Failed to get job details' });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      companyId: req.user.id,
      status: 'published'
    });

    const jobWithCompany = await Job.findByPk(job.id, {
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo']
      }]
    });

    res.status(201).json(jobWithCompany);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.id
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.update(req.body);

    const updatedJob = await Job.findByPk(job.id, {
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo']
      }]
    });

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.id
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumePath, coverLetter } = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = await Application.create({
      jobId: id,
      applicantId: req.user.id,
      resumePath,
      coverLetter,
      status: 'pending'
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Failed to apply for job' });
  }
}; 