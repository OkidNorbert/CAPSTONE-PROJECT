const { Application, User, Job, Interview, Note } = require('../../models');

// Get all applications for employer's jobs
exports.getApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;
    const whereClause = {};
    
    // If status is provided, filter by status
    if (status) {
      whereClause.status = status;
    }
    
    // Get all jobs by this employer
    const jobs = await Job.findAll({
      where: { companyId: req.user.id },
      attributes: ['id']
    });
    
    const jobIds = jobs.map(job => job.id);
    
    // If no jobs found
    if (jobIds.length === 0) {
      return res.json([]);
    }
    
    // If specific jobId is provided, filter by that job
    if (jobId) {
      if (!jobIds.includes(parseInt(jobId))) {
        return res.status(403).json({ message: 'You do not have access to this job' });
      }
      whereClause.jobId = jobId;
    } else {
      whereClause.jobId = jobIds;
    }
    
    const applications = await Application.findAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          where: { companyId: req.user.id },
          attributes: ['id', 'title', 'type', 'location']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture']
        },
        {
          model: Interview,
          attributes: ['id', 'date', 'time', 'type', 'location', 'notes']
        },
        {
          model: Note,
          attributes: ['id', 'content', 'createdAt'],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find the application
    const application = await Application.findByPk(id, {
      include: [{
        model: Job,
        attributes: ['companyId']
      }]
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the application belongs to a job posted by this employer
    if (application.Job.companyId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this application' });
    }
    
    // Update the status
    application.status = status;
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Schedule an interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, type, location, notes } = req.body;
    
    // Find the application
    const application = await Application.findByPk(id, {
      include: [{
        model: Job,
        attributes: ['companyId']
      }]
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the application belongs to a job posted by this employer
    if (application.Job.companyId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to schedule an interview for this application' });
    }
    
    // Create or update interview
    const [interview, created] = await Interview.findOrCreate({
      where: { applicationId: id },
      defaults: { date, time, type, location, notes }
    });
    
    if (!created) {
      await interview.update({ date, time, type, location, notes });
    }
    
    // Update application status to shortlisted if it's not already hired
    if (application.status !== 'hired') {
      application.status = 'shortlisted';
      await application.save();
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a note to an application
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    // Find the application
    const application = await Application.findByPk(id, {
      include: [{
        model: Job,
        attributes: ['companyId']
      }]
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the application belongs to a job posted by this employer
    if (application.Job.companyId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to add notes to this application' });
    }
    
    // Create note
    const note = await Note.create({
      applicationId: id,
      content,
      userId: req.user.id
    });
    
    res.status(201).json(note);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: error.message });
  }
}; 