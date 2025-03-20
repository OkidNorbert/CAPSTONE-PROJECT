const { Application, Job, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all applications for a job
// @route   GET /api/jobs/:jobId/applications
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for current user
// @route   GET /api/applications/me
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'companyName', 'companyLogo']
            }
          ]
        }
      ]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'companyName', 'companyLogo']
            }
          ]
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized to view this application
    if (
      application.applicant.id !== req.user.id &&
      application.job.company.id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer
    if (application.job.company.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add note to application
// @route   POST /api/applications/:id/notes
exports.addApplicationNote = async (req, res) => {
  try {
    const { note } = req.body;
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer
    if (application.job.company.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add notes to this application' });
    }

    const notes = [...(application.notes || []), { note, createdAt: new Date(), createdBy: req.user.id }];
    application.notes = notes;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule interview
// @route   POST /api/applications/:id/interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { scheduledAt, type, location, notes } = req.body;
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the employer
    if (application.job.company.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
    }

    application.interview = { scheduledAt, type, location, notes };
    application.status = 'interview';
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 