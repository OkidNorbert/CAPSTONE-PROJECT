const { Application, Job, User, Interview } = require('../../models');
const { Op } = require('sequelize');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { resumePath, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: id,
        applicantId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      jobId: id,
      applicantId: req.user.id,
      resumePath,
      coverLetter,
      status: 'pending'
    });

    const applicationWithDetails = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
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

// Get all applications for the current user
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: {
        applicantId: req.user.id
      },
      attributes: ['id', 'jobId', 'applicantId', 'coverLetter', 'status', 'appliedAt', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'type', 'location', 'status'],
          include: [{
            model: User,
            as: 'company',
            attributes: ['id', 'companyName', 'companyLogo']
          }]
        },
        {
          model: Interview,
          as: 'interviews',
          attributes: ['id', 'date', 'time', 'type', 'location', 'notes', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

// Get application details
exports.getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findOne({
      where: {
        id,
        applicantId: req.user.id
      },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'description', 'requirements', 'responsibilities'],
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'companyName', 'companyLogo', 'companyDescription']
            }
          ]
        },
        {
          model: Interview,
          as: 'interviews',
          attributes: ['id', 'date', 'time', 'type', 'location', 'notes', 'status']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ message: error.message });
  }
};

// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findOne({
      where: {
        id,
        applicantId: req.user.id,
        status: {
          [Op.in]: ['pending', 'reviewing']
        }
      }
    });

    if (!application) {
      return res.status(404).json({ 
        message: 'Application not found or cannot be withdrawn at current status' 
      });
    }

    await application.destroy();
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ message: error.message });
  }
}; 