const { Job, Application, User } = require('../../models');

// Create new job
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

// Get company jobs
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      include: [{
        model: User,
        as: 'company',
        attributes: ['id', 'companyName', 'companyLogo']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update job
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
    res.status(500).json({ message: error.message });
  }
};

// Delete job
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

    // Delete all applications for this job
    await Application.destroy({
      where: { jobId: job.id }
    });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get job applications
exports.getJobApplications = async (req, res) => {
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

    const applications = await Application.findAll({
      where: { jobId: job.id },
      include: [{
        model: User,
        as: 'applicant',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: error.message });
  }
}; 