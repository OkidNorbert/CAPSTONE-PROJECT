const { Job, User, Application } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      location, 
      type, 
      experienceMin, 
      experienceMax, 
      salaryMin, 
      salaryMax, 
      skills, 
      remote, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = req.query;
    
    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
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
    
    if (experienceMin) {
      whereClause.experienceMin = { [Op.gte]: parseInt(experienceMin) };
    }
    
    if (experienceMax) {
      whereClause.experienceMax = { [Op.lte]: parseInt(experienceMax) };
    }
    
    if (salaryMin) {
      whereClause.salaryMin = { [Op.gte]: parseInt(salaryMin) };
    }
    
    if (salaryMax) {
      whereClause.salaryMax = { [Op.lte]: parseInt(salaryMax) };
    }
    
    if (remote) {
      whereClause.remote = remote === 'true';
    }
    
    // Handle skills filtering
    if (skills) {
      const skillsArray = skills.split(',');
      // This assumes skills is stored as JSON array in the database
      // The exact implementation might need adjustment based on how skills are stored
      whereClause.skills = { [Op.overlap]: skillsArray };
    }
    
    // Build order array
    const order = [[sortBy, sortOrder]];
    
    // Get jobs with pagination
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo', 'location']
      }],
      order,
      offset,
      limit: parseInt(limit)
    });
    
    res.json({
      jobs,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ message: error.message });
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
        attributes: ['id', 'companyName', 'companyLogo', 'companyDescription', 'location']
      }]
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Get application count
    const applicationCount = await Application.count({
      where: { jobId: job.id }
    });
    
    // Add application count to response
    const jobWithApplicationCount = {
      ...job.toJSON(),
      applicationCount
    };
    
    res.json(jobWithApplicationCount);
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Job not found or not authorized' });
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
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }
    
    // Delete all applications for this job
    await Application.destroy({
      where: { jobId: job.id }
    });
    
    // Delete the job
    await job.destroy();
    
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: req.params.id,
        applicantId: req.user.id
      }
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    const application = await Application.create({
      jobId: req.params.id,
      applicantId: req.user.id,
      ...req.body,
      status: 'pending'
    });
    
    const applicationWithDetails = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          attributes: ['id', 'title', 'location', 'type']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    res.status(201).json(applicationWithDetails);
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: error.message });
  }
}; 